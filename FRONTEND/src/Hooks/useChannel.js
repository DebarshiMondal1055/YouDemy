import { useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useChannelQuery = (username) =>
  useQuery({
    queryKey: queryKeys.channel(username),
    queryFn: async () => {
      const response = await axiosClient.get(`/users/c/${username}`);
      return response.data.data;
    },
    enabled: !!username,
    staleTime: 2 * 60_000,
  });
