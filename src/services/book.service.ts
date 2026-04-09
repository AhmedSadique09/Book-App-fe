import { HttpService } from "./base.service";

class BookService extends HttpService {
  /**
   * Get all books with search, category filter and pagination
   */
  getBooks = async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    return this.get("books", params);
  };
}

export const bookService = new BookService();
