import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useTweetsQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.tweets(userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/tweets/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60_000,
  });

export const useCreateTweetMutation = () =>
  useMutation({
    mutationFn: async (content) => {
      const response = await axiosClient.post("/tweets/create-tweet", { content });
      return response.data.data;
    },
  });
