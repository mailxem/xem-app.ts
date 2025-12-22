"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MailingList } from "@/lib";
import { useTeam } from "./team-provider";
import { useApi } from "@/hooks/use-api";

type MailingListContextType = {
  lists: MailingList[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const MailingListContext = createContext<MailingListContextType>({
  lists: [],
  isLoading: true,
  error: null,
  refetch: async () => {},
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

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch("mailing-lists");
      if (!response.ok) {
        throw new Error("Failed to fetch mailing lists");
      }
      const { data } = await response.json();
      setLists(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (team?.id) {
      fetchLists();
    }
  }, [team?.id]);

  return (
    <MailingListContext.Provider
      value={{
        lists,
        isLoading,
        error,
        refetch: fetchLists,
      }}
    >
      {children}
    </MailingListContext.Provider>
  );
}
