// Base API client configuration that will target FastAPI backend in production
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.detail || errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // In mock mode / development fallback, we log and rethrow or fallback in individual service wrappers
    console.warn(`[ApiClient] Request to ${endpoint} failed, relying on mock fallback:`, error);
    throw error;
  }
}
