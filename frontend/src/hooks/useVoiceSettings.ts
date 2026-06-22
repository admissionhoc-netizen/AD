import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './useApi';

export interface VoiceProvider {
  id: string;
  name: string;
}

export interface VoiceSettings {
  provider: string;
  voice_id: string;
  model: string;
  is_active: boolean;
}

export function useVoiceSettings() {
  const [providers, setProviders] = useState<{ deepgram: { voices: VoiceProvider[] }; elevenlabs: { voices: VoiceProvider[] } } | null>(null);
  const [settings, setSettings] = useState<VoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    const data = await apiFetch('/api/voice/providers');
    setProviders(data);
  }, []);

  const fetchSettings = useCallback(async () => {
    const data = await apiFetch('/api/voice/settings');
    setSettings(data);
  }, []);

  const updateSettings = async (provider: string, voiceId: string) => {
    const data = await apiFetch('/api/voice/settings', {
      method: 'POST',
      body: JSON.stringify({ provider, voice_id: voiceId }),
    });
    setSettings(data.settings);
    return data;
  };

  useEffect(() => {
    Promise.all([fetchProviders(), fetchSettings()]).finally(() => setLoading(false));
  }, [fetchProviders, fetchSettings]);

  return { providers, settings, loading, updateSettings, refresh: fetchSettings };
}