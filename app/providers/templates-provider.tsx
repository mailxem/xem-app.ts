"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { EmailTemplate } from "@/lib";
import { useTeam } from "./team-provider";
import { useApi } from "@/hooks/use-api";

type TemplatesContextType = {
  templates: EmailTemplate[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  setPagination: (pagination: {
    page: number;
    limit: number;
    total: number;
  }) => void;
};

const TemplatesContext = createContext<TemplatesContextType>({
  templates: [],
  isLoading: true,
  error: null,
  refetch: async () => {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  setPagination: () => {},
});

export function useTemplates() {
  return useContext(TemplatesContext);
}

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { team } = useTeam();
  const { apiFetch } = useApi();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(
        "templates?limit=" +
          pagination.limit +
          "&page=" +
          pagination.page +
          "&team_id=" +
          team?.id,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.data);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
      });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (team?.id) {
      fetchTemplates();
    }
  }, [team?.id]);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        pagination,
        setPagination,
        isLoading,
        error,
        refetch: fetchTemplates,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
}
