import { HttpService } from "./base.service";

class AdminService extends HttpService {
  /**
   * Get all users with search and pagination
   */
  getUsers = async (params?: { search?: string; page?: number; limit?: number }) => {
    return this.get("admin/users", params);
  };
}

export const adminService = new AdminService();
