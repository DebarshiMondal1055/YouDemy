import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useCommentsQuery = (videoId) =>
  useQuery({
    queryKey: queryKeys.comments(videoId),
    queryFn: async () => {
      const response = await axiosClient.get(`/comments/v/${videoId}`);
      return response.data.data;
    },
    enabled: !!videoId,
    staleTime: 60_000,
  });

export const useAddCommentMutation = (videoId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content) => {
      const response = await axiosClient.post(`/comments/${videoId}`, { content });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(videoId) });
    },
  });
};
