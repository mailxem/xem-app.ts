"use client";

import { createContext, useContext, useState } from "react";
import { useTeam } from "./team-provider";
import { SMTPConfig } from "@/lib/validations/smtp-provider";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

type SMTPContextType = {
  configs: SMTPConfig[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

const SMTPContext = createContext<SMTPContextType>({
  configs: [],
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function useSMTP() {
  return useContext(SMTPContext);
}

export function SMTPProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<SMTPConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { team } = useTeam();
  const { apiFetch } = useApi();

  const refresh = () => {
    setIsLoading(true);
    refetchConfigs();
  };

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("smtp-configs?limit=100", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch SMTP configuration");
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
      throw new Error("Failed to fetch SMTP configuration: " + err.message);
    }
  };

  const { refetch: refetchConfigs } = useQuery({
    queryKey: ["smtp-configs", team?.id],
    queryFn: fetchConfig,
    enabled: !!team?.id,
  });

  return (
    <SMTPContext.Provider
      value={{
        configs,
        isLoading,
        error,
        refresh,
      }}
    >
      {children}
    </SMTPContext.Provider>
  );
}
