import { useMutation } from "@tanstack/react-query";
import axiosClient from "../utils/axiosClient";
import useAuthStore from "../store/authStore";

export const useUpdateAccountMutation = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  return useMutation({
    mutationFn: async ({ fullname, username, email }) => {
      const response = await axiosClient.patch("/users/change-account-details", {
        fullname,
        username,
        email,
      });
      return response.data.data;
    },
    onSuccess: () => fetchUser(),
  });
};

export const useUpdateAvatarMutation = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  return useMutation({
    mutationFn: async (avatarFile) => {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await axiosClient.patch("/users/update-avatar", formData);
      return response.data.data;
    },
    onSuccess: () => fetchUser(),
  });
};

export const useUpdateCoverImageMutation = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  return useMutation({
    mutationFn: async (coverImageFile) => {
      const formData = new FormData();
      formData.append("coverimage", coverImageFile);
      const response = await axiosClient.patch("/users/update-cover-image", formData);
      return response.data.data;
    },
    onSuccess: () => fetchUser(),
  });
};
