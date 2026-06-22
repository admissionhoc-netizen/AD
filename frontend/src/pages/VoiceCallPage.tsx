import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ─── CONFIG ──────────────────────────────────────────────────────────
const SAMPLE_RATE = 24000
const MIC_SAMPLE_RATE = 16000

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function VoiceCallPage() {
  const { user } = useAuth()
  const [callState, setCallState] = useState<'idle'|'connecting'|'active'|'ended'>('idle')
  const [timer, setTimer] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<{role: 'agent'|'caller', text: string}[]>([])
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<'listening'|'processing'|'speaking'|'idle'>('idle')

  const wsRef = useRef<WebSocket | null>(null)

  // Use a single persistent AudioContext
  const audioContextRef = useRef<AudioContext | null>(null)

  // AudioWorkletNode reference (replaces deprecated ScriptProcessorNode)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionIdRef = useRef<string>(`session_${Date.now()}`)

  // Audio queue for smooth playback with single AudioContext
  const audioQueueRef = useRef<Int16Array[]>([])
  const isPlayingRef = useRef(false)

  // Track if we should be sending audio (prevent sending while AI is speaking)
  const shouldSendAudioRef = useRef(true)

  // Audio accumulation buffer for smoother playback
  const audioAccumRef = useRef<Int16Array[]>([])
  const ACCUM_TARGET_MS = 150

  // Mic audio buffer for sending larger chunks
  const micBufferRef = useRef<number[]>([])
  const lastSendTimeRef = useRef(0)
  const SEND_INTERVAL_MS = 500

  // FIX: Track when user started speaking to prevent premature processing
  const userSpeakingStartRef = useRef<number | null>(null)
  const MIN_USER_SPEAKING_MS = 1500

  // Timer
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [callState])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  // Initialize single AudioContext on call start
  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE })
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
  }

  // Play audio from Int16Array PCM data using single AudioContext
  const playAudioChunk = async (int16Data: Int16Array): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const ctx = audioContextRef.current
        if (!ctx) {
          resolve()
          return
        }

        const floatData = new Float32Array(int16Data.length)
        for (let i = 0; i < int16Data.length; i++) {
          floatData[i] = int16Data[i] / 32768.0
        }

        const audioBuffer = ctx.createBuffer(1, floatData.length, SAMPLE_RATE)
        audioBuffer.copyToChannel(floatData, 0)

        const source = ctx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(ctx.destination)

        source.onended = () => { resolve() }
        source.start(0)

      } catch (err) {
        console.error('Audio playback error:', err)
        resolve()
      }
    })
  }

  // Process audio queue with accumulation for smooth playback
  const processAudioQueue = async () => {
    if (isPlayingRef.current) return

    isPlayingRef.current = true
    setIsAgentSpeaking(true)
    setCallStatus('speaking')

    try {
      while (audioQueueRef.current.length > 0 || audioAccumRef.current.length > 0) {
        while (audioQueueRef.current.length > 0) {
          const chunk = audioQueueRef.current.shift()
          if (chunk) audioAccumRef.current.push(chunk)
        }

        const totalSamples = audioAccumRef.current.reduce((sum, c) => sum + c.length, 0)
        const accumulatedMs = (totalSamples / SAMPLE_RATE) * 1000

        if (accumulatedMs >= ACCUM_TARGET_MS || audioQueueRef.current.length === 0) {
          if (totalSamples > 0) {
            const concatenated = new Int16Array(totalSamples)
            let offset = 0
            for (const chunk of audioAccumRef.current) {
              concatenated.set(chunk, offset)
              offset += chunk.length
            }
            audioAccumRef.current = []
            await playAudioChunk(concatenated)
          }
        }

        if (audioQueueRef.current.length === 0 && audioAccumRef.current.length === 0) {
          await new Promise(r => setTimeout(r, 50))
        }
      }
    } catch (err) {
      console.error('Queue processing error:', err)
    } finally {
      isPlayingRef.current = false
      setIsAgentSpeaking(false)
      // FIX: Clear any accumulated mic data that came in during AI speech
      micBufferRef.current = []
      lastSendTimeRef.current = Date.now()
      // Re-enable audio sending after AI finishes
      shouldSendAudioRef.current = true
      setIsUserSpeaking(false)
      setCallStatus('listening')
    }
  }

  // AudioWorklet processor code as a Blob URL
  const createAudioWorkletProcessor = () => {
    const processorCode = `
      class MicProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
          this.buffer = [];
        }

        process(inputs, outputs, parameters) {
          const input = inputs[0];
          if (input && input[0]) {
            const channelData = input[0];
            const int16Data = new Int16Array(channelData.length);
            for (let i = 0; i < channelData.length; i++) {
              int16Data[i] = Math.max(-1, Math.min(1, channelData[i])) * 0x7FFF;
            }
            this.port.postMessage(int16Data);
          }
          return true;
        }
      }

      registerProcessor('mic-processor', MicProcessor);
    `;

    const blob = new Blob([processorCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }

  // Start call with WebSocket
  const startCall = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in first')
      return
    }

    setCallState('connecting')
    setTimer(0)
    setMessages([])
    setIsAgentSpeaking(false)
    setIsUserSpeaking(false)
    setCallStatus('idle')

    await initAudioContext()

    const sessionId = sessionIdRef.current
    const ws = new WebSocket(`ws://localhost:8000/ws/voice/${sessionId}`)
    ws.binaryType = 'arraybuffer'

    ws.onopen = () => {
      console.log('WebSocket connected')
      setCallState('active')
      setCallStatus('listening')
      toast.success('Connected to AI Agent')
      startAudioCapture(ws)
    }

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'transcript') {
          setMessages(prev => [...prev, { role: 'caller', text: data.text }])
          setIsUserSpeaking(false)
          setCallStatus('processing')
        } else if (data.type === 'ai_response') {
          setMessages(prev => [...prev, { role: 'agent', text: data.text }])
          // Pause audio sending while AI is responding
          shouldSendAudioRef.current = false
          // FIX: Clear mic buffer so old audio doesn't get sent after AI finishes
          micBufferRef.current = []
          userSpeakingStartRef.current = null
        } else if (data.type === 'audio') {
          try {
            const binary = atob(data.data)
            const bytes = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i)
            }

            let byteLength = bytes.length
            if (byteLength % 2 !== 0) {
              byteLength -= 1
            }

            if (byteLength >= 2) {
              const int16Data = new Int16Array(bytes.buffer, 0, byteLength / 2)
              audioQueueRef.current.push(int16Data)

              if (!isPlayingRef.current) {
                processAudioQueue()
              }
            }
          } catch (decodeErr) {
            console.error('Audio decode error:', decodeErr)
          }
        }
      } catch (err) {
        console.error('Message parse error:', err)
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      toast.error('Connection error')
      setCallState('idle')
      setCallStatus('idle')
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      if (callState !== 'ended') {
        setCallState('ended')
        setCallStatus('idle')
      }
    }

    wsRef.current = ws
  }, [user])

  // Capture audio from mic using AudioWorkletNode
  const startAudioCapture = async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: MIC_SAMPLE_RATE, 
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      })
      mediaStreamRef.current = stream

      const audioContext = audioContextRef.current
      if (!audioContext) {
        throw new Error('AudioContext not initialized')
      }

      const processorUrl = createAudioWorkletProcessor()
      try {
        await audioContext.audioWorklet.addModule(processorUrl)
      } catch (err) {
        console.error('Failed to load AudioWorklet:', err)
        fallbackScriptProcessor(ws, audioContext, stream)
        return
      }

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source

      const workletNode = new AudioWorkletNode(audioContext, 'mic-processor', {
        processorOptions: { bufferSize: 4096 }
      })
      workletNodeRef.current = workletNode

      source.connect(workletNode)

      // Handle messages from worklet
      workletNode.port.onmessage = (e) => {
        if (ws.readyState !== WebSocket.OPEN || isMuted || !shouldSendAudioRef.current) return

        const int16Data = e.data as Int16Array

        // FIX: Track when user started speaking
        if (userSpeakingStartRef.current === null && int16Data.length > 0) {
          userSpeakingStartRef.current = Date.now()
        }

        // Add to buffer
        for (let i = 0; i < int16Data.length; i++) {
          micBufferRef.current.push(int16Data[i])
        }

        // Send in larger chunks (500ms) for better transcription
        const now = Date.now()
        if (now - lastSendTimeRef.current >= SEND_INTERVAL_MS && micBufferRef.current.length > 0) {
          const chunk = new Int16Array(micBufferRef.current)
          ws.send(chunk.buffer)
          micBufferRef.current = []
          lastSendTimeRef.current = now

          setIsUserSpeaking(true)
          if (callStatus !== 'speaking') {
            setCallStatus('listening')
          }
        }
      }

    } catch (err) {
      console.error('Audio capture error:', err)
      toast.error('Microphone access denied. Please allow microphone permissions.')
      endCall()
    }
  }

  // Fallback ScriptProcessorNode for older browsers
  const fallbackScriptProcessor = (ws: WebSocket, audioContext: AudioContext, stream: MediaStream) => {
    console.warn('Using fallback ScriptProcessorNode - AudioWorklet not available')
    const source = audioContext.createMediaStreamSource(stream)
    sourceRef.current = source

    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    source.connect(processor)

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN || isMuted || !shouldSendAudioRef.current) return

      const inputData = e.inputBuffer.getChannelData(0)
      const int16Data = float32ToInt16(inputData)

      if (userSpeakingStartRef.current === null && int16Data.length > 0) {
        userSpeakingStartRef.current = Date.now()
      }

      for (let i = 0; i < int16Data.length; i++) {
        micBufferRef.current.push(int16Data[i])
      }

      const now = Date.now()
      if (now - lastSendTimeRef.current >= SEND_INTERVAL_MS && micBufferRef.current.length > 0) {
        const chunk = new Int16Array(micBufferRef.current)
        ws.send(chunk.buffer)
        micBufferRef.current = []
        lastSendTimeRef.current = now

        setIsUserSpeaking(true)
        if (callStatus !== 'speaking') {
          setCallStatus('listening')
        }
      }
    }
  }

  const float32ToInt16 = (float32Array: Float32Array): Int16Array => {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7FFF
    }
    return int16Array
  }

  const endCall = useCallback(() => {
    if (workletNodeRef.current) {
      try { workletNodeRef.current.disconnect() } catch (e) {}
      workletNodeRef.current = null
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect() } catch (e) {}
      sourceRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop())
      mediaStreamRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    micBufferRef.current = []
    lastSendTimeRef.current = 0
    userSpeakingStartRef.current = null

    setCallState('ended')
    setIsAgentSpeaking(false)
    setIsUserSpeaking(false)
    setCallStatus('idle')
    audioQueueRef.current = []
    audioAccumRef.current = []
    isPlayingRef.current = false
    shouldSendAudioRef.current = true
  }, [])

  const handleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !newMuted
      })
    }
  }

  useEffect(() => {
    return () => { endCall() }
  }, [endCall])

  const getStatusText = () => {
    switch (callStatus) {
      case 'listening': return 'Listening... Speak now'
      case 'processing': return 'Processing...'
      case 'speaking': return 'AI is speaking...'
      default: return ''
    }
  }

  const getStatusColor = () => {
    switch (callStatus) {
      case 'listening': return 'text-emerald-400'
      case 'processing': return 'text-yellow-400'
      case 'speaking': return 'text-cyan-400'
      default: return 'text-zinc-500'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <span>← Back home</span>
      </Link>

      <div className="absolute top-6 right-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-white">ADhoc<span className="text-purple-400">.ai</span></span>
      </div>

      <AnimatePresence mode="wait">
        {callState === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Try our AI Voice Agent</h1>
            <p className="text-zinc-400 mb-8 max-w-md">
              Experience a real-time voice conversation with our Adhoc Agent. 
              Ask about colleges, courses, careers, and admissions.
            </p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startCall}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 mx-auto hover:shadow-purple-500/60 transition-shadow">
              <Phone size={32} className="text-white" />
            </motion.button>
            <p className="mt-4 text-zinc-500 text-sm">Tap to call</p>
          </motion.div>
        )}

        {callState === 'connecting' && (
          <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
                  transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }} />
              ))}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center">
                <Phone size={32} className="text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Connecting...</h2>
            <p className="text-zinc-400">Adhoc AI Agent</p>
          </motion.div>
        )}

        {(callState === 'active' || callState === 'ended') && (
          <motion.div key="active" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="glass rounded-2xl p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Adhoc AI</h3>
                    <p className="text-sm text-zinc-400">AI Career Counselor</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {formatTime(timer)}
                  </div>
                  <button onClick={endCall} className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-colors">
                    <PhoneOff size={18} />
                  </button>
                </div>
              </div>

              {/* FIX: Better status indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`text-sm font-medium animate-pulse ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>

              <div className="flex items-center justify-center gap-0.5 h-12">
                {[...Array(40)].map((_, i) => (
                  <motion.div key={i} className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full"
                    animate={{ 
                      height: callState === 'active' && (isUserSpeaking || isAgentSpeaking) 
                        ? [4, 8 + Math.random() * 20, 4] 
                        : 4 
                    }}
                    transition={{ duration: 0.5, delay: i * 0.02, repeat: Infinity }} />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 mb-4 h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs text-zinc-500 font-medium tracking-wider">LIVE TRANSCRIPT</h4>
                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {callState === 'active' ? 'Live' : 'Call Ended'}
                </span>
              </div>

              <div className="space-y-4">
                {messages.length === 0 && callState === 'active' && (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 text-sm">Say something to start the conversation...</p>
                    <p className="text-zinc-600 text-xs mt-2">Try: "What colleges are good for Computer Science?"</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'caller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === 'caller' 
                        ? 'bg-purple-600/20 text-white rounded-br-md' 
                        : 'bg-white/5 text-zinc-300 rounded-bl-md'
                    }`}>
                      <p className="text-xs text-purple-400 mb-1">{msg.role === 'agent' ? 'AI Agent' : 'You'}</p>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {callState === 'active' && messages.length > 0 && messages[messages.length - 1].role === 'caller' && !isAgentSpeaking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                        <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: 0.2, repeat: Infinity }} />
                        <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, delay: 0.4, repeat: Infinity }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {callState === 'active' && (
              <div className="flex justify-center gap-4">
                <button onClick={handleMute} 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button onClick={endCall}
                  className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/30">
                  <PhoneOff size={22} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
                  <Volume2 size={22} />
                </button>
              </div>
            )}

            {callState === 'ended' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-zinc-400 mb-4">Call ended • {formatTime(timer)}</p>
                <button onClick={startCall} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium transition-all">
                  Call Again
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}