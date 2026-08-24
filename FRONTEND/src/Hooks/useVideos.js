import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useHomeVideosQuery = (category) =>
  useQuery({
    queryKey: queryKeys.homeVideos(category),
    queryFn: async () => {
      const response = await axiosClient.get(`/videos?category=${category}`);
      return response.data.data;
    },
    staleTime: 60_000,
  });

export const useVideoQuery = (videoId) =>
  useQuery({
    queryKey: queryKeys.video(videoId),
    queryFn: async () => {
      const response = await axiosClient.get(`/videos/v/${videoId}`);
      return response.data.data;
    },
    enabled: !!videoId,
    staleTime: 60_000,
  });

export const useSuggestedVideosQuery = (videoId, title, category) =>
  useQuery({
    queryKey: queryKeys.suggestedVideos(videoId, title),
    queryFn: async () => {
      const [byTitle, byCategory] = await Promise.all([
        axiosClient.get(`/videos/get-all-videos?query=${title}`),
        axiosClient.get(`/videos?category=${category}`),
      ]);

      const seenIds = new Set();
      const suggestions = [];
      [...byTitle.data.data, ...byCategory.data.data].forEach((video) => {
        if (video._id !== videoId && !seenIds.has(video._id)) {
          seenIds.add(video._id);
          suggestions.push(video);
        }
      });
      return suggestions;
    },
    enabled: !!title && !!category,
    staleTime: 60_000,
  });

export const useSearchVideosQuery = (query) =>
  useQuery({
    queryKey: queryKeys.searchVideos(query),
    queryFn: async () => {
      const response = await axiosClient.get(`/videos/get-all-videos?query=${query}`);
      return response.data.data;
    },
    enabled: !!query,
    staleTime: Infinity,
  });

export const useUserVideosQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.userVideos(userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/videos/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

export const useUpdateVideoMutation = () =>
  useMutation({
    mutationFn: async ({ videoId, title, description }) => {
      const response = await axiosClient.patch(`/videos/v/${videoId}`, { title, description });
      return response.data.data;
    },
  });

export const useDeleteVideoMutation = () =>
  useMutation({
    mutationFn: async (videoId) => {
      await axiosClient.post(`/videos/v/${videoId}`);
      await axiosClient.post(`/likes/delete/v/${videoId}`);
      await axiosClient.post(`/playlists/v/${videoId}`);
      return videoId;
    },
  });

export const useUploadVideoMutation = () =>
  useMutation({
    mutationFn: async (formData) => {
      const response = await axiosClient.post("/videos/uploadVideo", formData);
      return response.data.data;
    },
  });

export const useInvalidateUserVideos = () => {
  const queryClient = useQueryClient();
  return (userId) => queryClient.invalidateQueries({ queryKey: queryKeys.userVideos(userId) });
};
