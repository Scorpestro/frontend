const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  discussion_count: number;
}

export interface Discussion {
  id: number;
  title: string;
  content?: string;
  author: User;
  category: Category;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  reply_count: number;
  last_reply?: Reply;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
  is_solution: boolean;
}

export interface UserProfile {
  user: User;
  bio: string;
  location: string;
  website: string;
  joined_date: string;
  post_count: number;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.loadStoredToken();
  }

  private async loadStoredToken() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          this.token = storedToken;
        }
      }
    } catch (error) {
      console.error('Failed to load stored token:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return this.token;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request('/categories/') as any;
    // Handle paginated response from Django REST Framework
    return response.results || response;
  }

  // Discussions
  async getDiscussions(categoryId?: number): Promise<Discussion[]> {
    const query = categoryId ? `?category=${categoryId}` : '';
    const response = await this.request(`/discussions/${query}`) as any;
    // Handle paginated response from Django REST Framework
    return response.results || response;
  }

  async getDiscussion(id: number): Promise<Discussion> {
    return this.request<Discussion>(`/discussions/${id}/`);
  }


  async createDiscussion(data: {
    title: string;
    content: string;
    category: number;
  }): Promise<Discussion> {
    return this.request<Discussion>('/discussions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscussion(
    id: number,
    data: Partial<{ title: string; content: string; category: number }>
  ): Promise<Discussion> {
    return this.request<Discussion>(`/discussions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscussion(id: number): Promise<void> {
    return this.request<void>(`/discussions/${id}/`, {
      method: 'DELETE',
    });
  }

  async getRecentDiscussions(): Promise<Discussion[]> {
    return this.request<Discussion[]>('/discussions/recent/');
  }

  // Replies
  async getReplies(discussionId: number): Promise<Reply[]> {
    const response = await this.request(`/discussions/${discussionId}/replies/`) as any;
    return response.results || response;
  }

  async createReply(discussionId: number, content: string): Promise<Reply> {
    return this.request<Reply>(`/discussions/${discussionId}/replies/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updateReply(id: number, content: string): Promise<Reply> {
    return this.request<Reply>(`/replies/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteReply(id: number): Promise<void> {
    return this.request<void>(`/replies/${id}/`, {
      method: 'DELETE',
    });
  }

  // Authentication
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    // Store the token for future requests
    this.setToken(response.token);
    return response;
  }

  async register(data: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout/', {
      method: 'POST',
    });
    this.setToken(null);
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/user/');
  }

  // User Profile
  async getUserProfile(userId: number): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${userId}/profile/`);
  }
}

export const apiService = new ApiService();
