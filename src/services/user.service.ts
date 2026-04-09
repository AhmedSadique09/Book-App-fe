import { HttpService } from "./base.service";

class UserService extends HttpService {
  /**
   * Update user profile (name, image, password)
   */
  updateProfile = async (data: {
    username?: string;
    currentPassword?: string;
    newPassword?: string;
    profileImage?: string | null;
  }) => {
    const formData = new FormData();

    if (data.username) {
      formData.append("username", data.username);
    }

    if (data.currentPassword && data.newPassword) {
      formData.append("currentPassword", data.currentPassword);
      formData.append("newPassword", data.newPassword);
    }

    if (data.profileImage) {
      const filename = data.profileImage.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("profileImage", {
        uri: data.profileImage,
        name: filename,
        type,
      } as any);
    }

    return this.patch("user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
}

export const userService = new UserService();
