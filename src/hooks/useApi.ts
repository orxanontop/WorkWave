'use client';

import { useState, useCallback } from 'react';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  fetch: (url: string, options?: FetchOptions) => Promise<T | null>;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (url: string, options?: FetchOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Something went wrong');
        return null;
      }

      setData(json.data);
      return json.data;
    } catch (err) {
      setError('Network error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, fetch: fetchData };
}

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    page,
    limit,
    total,
    totalPages,
    setTotal,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    setPage,
  };
}
