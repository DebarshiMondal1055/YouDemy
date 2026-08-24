import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import { queryKeys } from "../utils/queryKeys";

export const useCoursesQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.courses(userId),
    queryFn: async () => {
      const response = await axiosClient.get(`/playlists/p/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60_000,
  });

export const useCreateCourseMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description, videoIds }) => {
      const created = await axiosClient.post("/playlists/create-playlist", { name, description });
      const course = created.data.data;
      if (videoIds?.length) {
        await axiosClient.post(`/playlists/${course._id}/videos`, { videoIds });
      }
      return course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses(userId) });
    },
  });
};

export const useUpdateCourseMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, name, description }) => {
      const response = await axiosClient.patch(`/playlists/${courseId}`, { name, description });
      return response.data.data;
    },
    onSuccess: (updatedCourse, { courseId }) => {
      queryClient.setQueryData(queryKeys.courses(userId), (oldCourses = []) =>
        oldCourses.map((course) => (course._id === courseId ? { ...course, ...updatedCourse } : course))
      );
    },
  });
};

export const useDeleteCourseMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId) => {
      await axiosClient.post(`/playlists/p/${courseId}`, {});
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.setQueryData(queryKeys.courses(userId), (oldCourses = []) =>
        oldCourses.filter((course) => course._id !== courseId)
      );
    },
  });
};

export const useAddVideoToCourseMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, videoId }) => {
      const response = await axiosClient.post(`/playlists/${courseId}/videos`, { videoIds: [videoId] });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses(userId) });
    },
  });
};

export const useRemoveVideoFromCourseMutation = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, videoId }) => {
      await axiosClient.post(`/playlists/p/${courseId}/v/${videoId}`, {});
      return { courseId, videoId };
    },
    onSuccess: ({ courseId, videoId }) => {
      queryClient.setQueryData(queryKeys.courses(userId), (oldCourses = []) =>
        oldCourses.map((course) =>
          course._id === courseId
            ? { ...course, videoList: course.videoList.filter((video) => video._id !== videoId) }
            : course
        )
      );
    },
  });
};
