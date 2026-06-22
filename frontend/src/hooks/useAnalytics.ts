import { useState, useEffect } from 'react';
import { apiFetch } from './useApi';

export function useAnalytics() {
  const [summary, setSummary] = useState<any>(null);
  const [callsOverTime, setCallsOverTime] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any[]>([]);
  const [topAgents, setTopAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/api/analytics/summary'),
      apiFetch('/api/analytics/calls-over-time?days=30'),
      apiFetch('/api/analytics/sentiment'),
      apiFetch('/api/analytics/top-agents'),
    ]).then(([s, c, se, ta]) => {
      setSummary(s);
      setCallsOverTime(c);
      setSentiment(se);
      setTopAgents(ta);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { summary, callsOverTime, sentiment, topAgents, loading };
}