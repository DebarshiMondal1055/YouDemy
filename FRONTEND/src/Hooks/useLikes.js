import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useLikedVideosQuery = () =>
  useQuery({
    queryKey: queryKeys.likedVideos(),
    queryFn: async () => {
      const response = await axiosClient.get("/likes/videos");
      return response.data.data;
    },
    staleTime: 60_000,
  });

// Caller supplies onSuccess (via mutate(videoId, {onSuccess})) to patch the
// video-detail cache entry with the returned isLiked/likesCount.
export const useToggleVideoLikeMutation = () =>
  useMutation({
    mutationFn: async (videoId) => {
      const response = await axiosClient.post(`/likes/toggle/v/${videoId}`, {});
      return response.data.data;
    },
  });
