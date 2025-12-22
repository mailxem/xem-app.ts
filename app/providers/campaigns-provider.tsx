"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTeam } from "./team-provider";
import { Campaign } from "@/lib";
import { useApi } from "@/hooks/use-api";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";

type CampaignsContextType = {
  campaigns: Campaign[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<void, Error>>;
  getCampaign: (id: string) => Promise<QueryObserverResult<Campaign, Error>>;
  campaign: Campaign | null;
  total: number;
  page: number;
  limit: number;
  setTotal: (total: number) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const CampaignsContext = createContext<CampaignsContextType>({
  campaigns: [],
  loading: false,
  error: null,
  refetch: async () =>
    ({
      data: undefined,
      error: undefined,
      isLoading: false,
      isError: false,
    }) as QueryObserverResult<void, Error>,
  getCampaign: async () =>
    ({
      data: undefined,
      error: undefined,
      isLoading: false,
      isError: false,
    }) as QueryObserverResult<Campaign, Error>,
  campaign: null,
  total: 0,
  page: 1,
  limit: 20,
  setTotal: () => {},
  setPage: () => {},
  setLimit: () => {},
});

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { team } = useTeam();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { apiFetch } = useApi();

  const getCampaign = async (id: string) => {
    try {
      const response = await apiFetch("campaigns?include=Template&id=" + id);
      if (!response.ok) {
        throw new Error("Failed to fetch campaign");
      }
      const { data } = await response.json();
      setCampaign(data[0]);
      return data[0];
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(
        "campaigns?team_id=" + team?.id + "&page=" + page + "&limit=" + limit
      );

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      const data = await response.json();
      setCampaigns(data.data);
      setTotal(data.total);
      setPage(data.page);
      setLimit(data.limit);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const { refetch: refetchCampaigns } = useQuery({
    queryKey: ["campaigns", team?.id],
    queryFn: fetchCampaigns,
    enabled: !!team?.id,
  });

  return (
    <CampaignsContext.Provider
      value={{
        campaigns,
        loading,
        error,
        refetch: refetchCampaigns,
        getCampaign,
        campaign,
        total,
        page,
        limit,
        setTotal,
        setPage,
        setLimit,
      }}
    >
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignsProvider");
  }
  return context;
}
