import { HttpService } from "./base.service";

class AdminService extends HttpService {
  /**
   * Get all users with search and pagination
   */
  getUsers = async (params?: { search?: string; page?: number; limit?: number }) => {
    return this.get("admin/users", params);
  };

  /**
   * Create a new book
   */
  postBook = async (data: {
    title: string;
    authorName: string;
    category: string;
    description: string;
    coverImage?: string | null;
    pdfFile: string;
    pdfFileName: string;
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("authorName", data.authorName);
    formData.append("category", data.category.toLowerCase());
    formData.append("description", data.description);

    if (data.coverImage) {
      const filename = data.coverImage.split("/").pop() || "cover.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("coverImage", {
        uri: data.coverImage,
        name: filename,
        type,
      } as any);
    }

    formData.append("pdfFile", {
      uri: data.pdfFile,
      name: data.pdfFileName,
      type: "application/pdf",
    } as any);

    return this.post("admin/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
}

export const adminService = new AdminService();
