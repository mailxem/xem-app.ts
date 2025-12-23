"use client";

import { createContext, useContext, useState } from "react";
import { useTeam } from "./team-provider";
import { IMAPConfig } from "@/lib/validations/imap-provider";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

type IMAPContextType = {
  configs: IMAPConfig[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

const IMAPContext = createContext<IMAPContextType>({
  configs: [],
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function useIMAP() {
  return useContext(IMAPContext);
}

export function IMAPProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<IMAPConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { team } = useTeam();
  const { apiFetch } = useApi();

  const refresh = () => {
    setIsLoading(true);
    fetchConfig();
  };

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("imap?limit=100&team_id=" + team?.id);
      if (!response.ok) {
        throw new Error("Failed to fetch IMAP configuration");
      }
      const { data } = await response.json();
      setConfigs(data);
      setError(null);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useQuery({
    queryKey: ["imap-configs", team?.id],
    queryFn: fetchConfig,
    enabled: !!team?.id,
  });

  return (
    <IMAPContext.Provider
      value={{
        configs,
        isLoading,
        error,
        refresh,
      }}
    >
      {children}
    </IMAPContext.Provider>
  );
}
