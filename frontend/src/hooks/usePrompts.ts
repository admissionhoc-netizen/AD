import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from './useApi';

export interface Prompt {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  user_prompt_template: string;
  variables: string[];
  temperature: number;
  is_active: boolean;
  created_at: string;
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('/api/prompts');
    setPrompts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const createPrompt = async (data: Omit<Prompt, 'id' | 'created_at'>) => {
    const result = await apiFetch('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await fetchPrompts();
    return result;
  };

  const updatePrompt = async (id: string, data: { temperature?: number; system_prompt?: string }) => {
    const result = await apiFetch(`/api/prompts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    await fetchPrompts();
    return result;
  };

  const testPrompt = async (id: string, variables: Record<string, string>) => {
    return apiFetch(`/api/prompts/${id}/test`, {
      method: 'POST',
      body: JSON.stringify(variables),
    });
  };

  return { prompts, loading, createPrompt, updatePrompt, testPrompt, refresh: fetchPrompts };
}