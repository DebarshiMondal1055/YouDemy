import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useSubscribedToQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.subscribedTo(userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/subscriptions/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

export const useSubscribersQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.subscribers(userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/subscriptions/c/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

// Generic toggle: caller supplies onSuccess (via mutate(channelId, {onSuccess}))
// to patch whichever cache entry (video detail vs channel profile) holds the
// subscribe state for that screen.
export const useToggleSubscribeMutation = () =>
  useMutation({
    mutationFn: async (channelId) => {
      const response = await axiosClient.post(`/subscriptions/c/${channelId}`, {});
      return response.data.data;
    },
  });
