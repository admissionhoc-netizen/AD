import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './useApi';

interface Call {
  id: number;
  status: string;
  duration: number;
  topic: string | null;
  sentiment: string | null;
  cost: number;
  recording_url: string | null;
  created_at: string;
  ended_at: string | null;
  transcript_count: number;
  agent?: string;
  caller?: string;
}

export function useCalls(skip = 0, limit = 50, status?: string) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('/api/calls');
    setCalls(data || []);
    setTotal((data || []).length);
    setLoading(false);
  }, [skip, limit, status]);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  const initiateCall = async (userId: number, agentId?: number, topic?: string, phone?: string) => {
    return apiFetch('/api/calls/initiate', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, agent_id: agentId, topic, phone_number: phone }),
    });
  };

  const endCall = async (callId: number) => {
    return apiFetch(`/api/calls/${callId}/end`, { method: 'POST' });
  };

  const getTranscript = async (callId: number) => {
    return apiFetch(`/api/calls/${callId}/transcript`);
  };

  return { calls, total, loading, fetchCalls, initiateCall, endCall, getTranscript };
}