"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MailingList } from "@/lib";
import { useTeam } from "./team-provider";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

type MailingListContextType = {
  lists: MailingList[];
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

const MailingListContext = createContext<MailingListContextType>({
  lists: [],
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

export function useMailingLists() {
  return useContext(MailingListContext);
}

export function MailingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lists, setLists] = useState<MailingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { team } = useTeam();
  const { apiFetch } = useApi();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(
        "mailing-lists?sort=subscribers_count&order=desc&page=" +
          pagination.page +
          "&limit=" +
          pagination.limit
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mailing lists");
      }
      const data = await response.json();
      setLists(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
      });
      setError(null);
      return data.data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      throw new Error("Failed to fetch mailing lists: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useQuery({
    queryKey: ["mailing-lists", team?.id, pagination.page, pagination.limit],
    queryFn: fetchLists,
    enabled: !!team?.id && pagination.page > 0 && pagination.limit > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return (
    <MailingListContext.Provider
      value={{
        lists,
        isLoading,
        error,
        pagination,
        refetch: fetchLists,
        setPagination,
      }}
    >
      {children}
    </MailingListContext.Provider>
  );
}
