import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useWatchHistoryQuery = () =>
  useQuery({
    queryKey: queryKeys.history(),
    queryFn: async () => {
      const response = await axiosClient.get("/users/history");
      return response.data.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
