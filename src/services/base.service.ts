import axios, {
  type CancelTokenStatic,
  type CancelTokenSource,
} from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Storage helper — SecureStore for mobile, localStorage for web
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : null;
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      typeof localStorage !== "undefined" &&
        localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === "web") {
      typeof localStorage !== "undefined" &&
        localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

const Config = process.env.EXPO_PUBLIC_API_URL;

// Global flag to prevent multiple auth redirects
let isRedirecting = false;

export class HttpService {
  CancelToken: CancelTokenStatic;
  source: CancelTokenSource;

  constructor() {
    this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();

    // Set token from storage on initialization
    HttpService.getToken().then((token) => {
      if (token) {
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
      }
    });

    // Response interceptor for 401/403
    axios.interceptors.response.use(undefined, async (error) => {
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        if (isRedirecting) {
          return Promise.reject(error);
        }

        isRedirecting = true;
        await HttpService.clearStorage();
        delete axios.defaults.headers["Authorization"];
        // Lazy import to avoid accessing navigation context at module load
        const expoRouter = await import("expo-router");
        expoRouter.router.replace("/(auth)/signin");
      }
      return Promise.reject(error);
    });
  }

  /**
   * Set Token and Axios Headers
   */
  static async setToken(token: string): Promise<void> {
    isRedirecting = false;
    await storage.set("token", token);
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Get Token
   */
  static async getToken(): Promise<string> {
    return (await storage.get("token")) ?? "";
  }

  /**
   * Clear all stored data
   */
  static async clearStorage(): Promise<void> {
    isRedirecting = false;
    await storage.remove("token");
    await storage.remove("userId");
    await storage.remove("email");
    await storage.remove("fullName");
    await storage.remove("userType");
    await storage.remove("profilePicture");
    delete axios.defaults.headers["Authorization"];
  }

  /**
   * Set a value in storage
   */
  static async setItem(key: string, value: string): Promise<void> {
    await storage.set(key, value);
  }

  /**
   * Get a value from storage
   */
  static async getItem(key: string): Promise<string | null> {
    return await storage.get(key);
  }

  /**
   * Remove a value from storage
   */
  static async removeItem(key: string): Promise<void> {
    await storage.remove(key);
  }

  /**
   * GET request
   */
  protected get = async (url: string, params?: any): Promise<any> => {
    const res = await axios.get(`${Config}/${url}`, {
      params,
      cancelToken: this.source.token,
    });
    return res.data;
  };

  /**
   * POST request
   */
  protected post = async (
    url: string,
    body?: any,
    options = {},
  ): Promise<any> => {
    const res = await axios.post(`${Config}/${url}`, body, {
      ...options,
      cancelToken: this.source.token,
    });
    return res.data;
  };

  /**
   * DELETE request
   */
  protected delete = async (
    url: string,
    params?: any,
    data?: any,
  ): Promise<any> => {
    const res = await axios.delete(`${Config}/${url}`, { params, data });
    return res.data;
  };

  /**
   * PUT request
   */
  protected put = async (
    url: string,
    body?: any,
    params?: any,
  ): Promise<any> => {
    const res = await axios.put(`${Config}/${url}`, body, {
      ...params,
      cancelToken: this.source.token,
    });
    return res.data;
  };

  private updateCancelToken() {
    this.source = this.CancelToken.source();
  }

  cancel = () => {
    this.source.cancel("Explicitly cancelled HTTP request");
    this.updateCancelToken();
  };
}
