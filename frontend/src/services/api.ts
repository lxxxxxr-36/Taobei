// 在开发环境使用相对路径，让Vite代理处理
// 在生产环境需要配置实际的API地址
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:5173/api'  // 生产环境
  : '/api';                      // 开发环境，使用Vite代理

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RequestCodeResponse {
  ttlSeconds: number;
}

export interface LoginResponse {
  userId: string;
  phoneNumber: string;
  token?: string;
}

export interface RegisterResponse {
  userId: string;
  phoneNumber: string;
  createdAt: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          message: data.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误',
      };
    }
  }

  // 请求登录验证码
  async requestLoginCode(phoneNumber: string): Promise<ApiResponse<RequestCodeResponse>> {
    return this.request<RequestCodeResponse>('/auth/request-code', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // 用户登录
  async login(phoneNumber: string, verificationCode: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, verificationCode }),
    });
  }

  // 请求注册验证码
  async requestRegisterCode(phoneNumber: string): Promise<ApiResponse<RequestCodeResponse>> {
    return this.request<RequestCodeResponse>('/auth/register/request-code', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  // 用户注册
  async register(
    phoneNumber: string,
    verificationCode: string,
    agreeToProtocol: boolean
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, verificationCode, agreeToProtocol }),
    });
  }
}

export const apiService = new ApiService();