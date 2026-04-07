import { HttpService } from "./base.service";

class AuthService extends HttpService {
  /**
   * Register a new user
   */
  signup = async (data: {
    email: string;
    username: string;
    password: string;
    profileImage?: string | null;
  }) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);

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

    return this.post("auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
}

export const authService = new AuthService();
