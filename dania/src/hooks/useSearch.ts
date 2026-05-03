import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ai } from '@/services/ai';

export function useSearch(query: string, debounceMs = 300) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, debounceMs]);

  return useQuery({
    queryKey: ['search', debounced],
    queryFn: () => ai.searchProjects(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 30_000,
  });
}
