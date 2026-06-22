import { useRef, useCallback, useState } from 'react';

interface TranscriptMessage {
  role: 'agent' | 'caller';
  text: string;
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [connected, setConnected] = useState(false);

  const connect = useCallback((callId: number) => {
    setMessages([]);
    setConnected(false);
    const socket = new WebSocket(`ws://localhost:8000/ws/calls/${callId}`);
    socket.onopen = () => {
      setConnected(true);
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'agent' || data.role === 'agent') {
        setMessages(prev => [...prev, { role: 'agent', text: data.text }]);
      } else if (data.type === 'user' || data.role === 'caller') {
        setMessages(prev => [...prev, { role: 'caller', text: data.text }]);
      } else if (data.text) {
        setMessages(prev => [...prev, { role: 'agent', text: data.text }]);
      }
    };
    socket.onclose = () => {
      setConnected(false);
    };
    socket.onerror = () => {
      setConnected(false);
    };
    ws.current = socket;
  }, []);

  const send = useCallback((text: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ text }));
      setMessages(prev => [...prev, { role: 'caller', text }]);
    }
  }, []);

  const disconnect = useCallback(() => {
    ws.current?.close();
    ws.current = null;
  }, []);

  return { messages, connected, connect, send, disconnect };
}