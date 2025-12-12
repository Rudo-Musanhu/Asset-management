import { WarrantyLoginRequest, WarrantyLoginResponse, WarrantyRegisterRequest, WarrantyRegisterResponse, DjangoApiError } from '../types';

const DJANGO_API_BASE = 'http://127.0.0.1:8000/api/warranty';

class DjangoApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    console.log('[DjangoApiClient] Setting access token:', token.substring(0, 20) + '...');
    this.accessToken = token;
    // Also store in sessionStorage as backup
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('warranty_access_token', token);
      console.log('[DjangoApiClient] Token stored in sessionStorage');
    }
  }

  getAccessToken(): string | null {
    // Try to get from memory first
    if (this.accessToken) {
      console.log('[DjangoApiClient] Token from memory');
      return this.accessToken;
    }
    
    // Fall back to sessionStorage
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('warranty_access_token');
      if (storedToken) {
        console.log('[DjangoApiClient] Token from sessionStorage');
        this.accessToken = storedToken;
        return storedToken;
      }
    }
    
    console.log('[DjangoApiClient] No token found');
    return null;
  }

  clearAccessToken() {
    console.log('[DjangoApiClient] Clearing access token');
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('warranty_access_token');
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, any>
  ): Promise<T> {
    const url = `${DJANGO_API_BASE}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is set
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include', // Include cookies if needed
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      console.log(`[DjangoAPI] ${method} ${url}`, body);
      console.log(`[DjangoAPI] Full request body:`, JSON.stringify(body, null, 2));
      console.log(`[DjangoAPI] Headers being sent:`, headers);
      const response = await fetch(url, options);

      console.log(`[DjangoAPI] Response status: ${response.status}`);
      console.log(`[DjangoAPI] Response headers:`, {
        'Content-Type': response.headers.get('Content-Type'),
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      });

      // Handle both 200 OK and 201 Created as success
      if (response.status < 200 || response.status >= 300) {
        let errorData: any = {};
        try {
          const text = await response.text();
          console.log(`[DjangoAPI] Response text:`, text);
          errorData = text ? JSON.parse(text) : { error: response.statusText };
        } catch (e) {
          errorData = { error: response.statusText };
        }
        
        console.error(`[DjangoAPI] Error response (status ${response.status}):`, errorData);
        
        const errorMessage =
          errorData.detail ||
          errorData.message ||
          errorData.error ||
          errorData.non_field_errors?.[0] ||
          `API Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`[DjangoAPI] Response data:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`[DjangoAPI] Exception:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to Django API');
    }
  }

  async login(credentials: WarrantyLoginRequest): Promise<WarrantyLoginResponse> {
    console.log('[DjangoApiClient] login() called with username:', credentials.username);
    const response = await this.makeRequest<WarrantyLoginResponse>('/login/', 'POST', credentials);
    console.log('[DjangoApiClient] Login response received:', response);
    
    if (response.access) {
      console.log('[DjangoApiClient] Found access token in response, setting it now');
      this.setAccessToken(response.access);
      console.log('[DjangoApiClient] Access token has been set');
    } else {
      console.error('[DjangoApiClient] No access token in login response!', response);
    }
    return response;
  }

  async registerWarranty(warrantyData: WarrantyRegisterRequest): Promise<WarrantyRegisterResponse> {
    console.log('[DjangoApiClient] registerWarranty called');
    
    // Always use getAccessToken() to check both memory and sessionStorage
    const token = this.getAccessToken();
    console.log('[DjangoApiClient] Current token:', token ? 'Token exists' : 'NO TOKEN');
    
    if (!token) {
      console.error('[DjangoApiClient] No access token found!');
      throw new Error('Not authenticated. Please login first.');
    }
    console.log('[DjangoApiClient] Proceeding with warranty registration...');
    return await this.makeRequest<WarrantyRegisterResponse>('/register/', 'POST', warrantyData);
  }

  async logout() {
    this.clearAccessToken();
  }
}

// Singleton instance
export const djangoApiClient = new DjangoApiClient();
