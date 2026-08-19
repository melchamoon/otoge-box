"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import LoadingStatus from "@/enums/LoadingStatus";
import { useGameContext } from "@/contexts/GameContext";
import { buildEmptyData, preprocessData } from "@/lib/utils/data";
import type { Data } from "@/types";

const EMPTY_DATA = buildEmptyData();

export function useGameDataQuery(): UseQueryResult<Data, Error> {
  const { gameCode, dataSourceUrl } = useGameContext();
  return useQuery<Data, Error>({
    queryKey: ["gameData", gameCode, dataSourceUrl],
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    queryFn: async () => {
      const response = await fetch(`${dataSourceUrl}/data.json`);
      if (!response.ok)
        throw new Error(`Failed to load data.json (${response.status})`);
      const data = (await response.json()) as Data;
      preprocessData(data, dataSourceUrl, gameCode);
      return data;
    },
  });
}

export function useCurrentData() {
  return useGameDataQuery().data ?? EMPTY_DATA;
}

export function toLoadingStatus(query: UseQueryResult) {
  if (query.isError) return LoadingStatus.ERROR;
  if (query.isFetching) return LoadingStatus.LOADING;
  if (query.isSuccess) return LoadingStatus.LOADED;
  return LoadingStatus.PENDING;
}
