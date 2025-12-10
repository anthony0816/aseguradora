import { apiBaseUrl } from "@/shared/consts/baseUrl";
import { tk } from "@/core/auth/consts/consts";

// Configuración base para las peticiones API
export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(tk.access_token);
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private static async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  }

  // Métodos genéricos para HTTP
  static async get(endpoint: string) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async post(endpoint: string, data: any) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  static async put(endpoint: string, data: any) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  static async delete(endpoint: string) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Métodos específicos para autenticación
  static async login(email: string, password: string) {
    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  static async register(name: string, email: string, password: string, password_confirmation: string) {
    const response = await fetch(`${apiBaseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    return this.handleResponse(response);
  }

  static async getCurrentUser() {
    return this.get('/api/me');
  }

  // Métodos específicos para cuentas
  static async getAccounts(all = false) {
    const endpoint = all ? '/api/accounts?all=true' : '/api/accounts';
    return this.get(endpoint);
  }

  static async getAccount(id: number) {
    return this.get(`/api/accounts/${id}`);
  }

  static async createAccount(data: any) {
    return this.post('/api/accounts', data);
  }

  static async updateAccount(id: number, data: any) {
    return this.put(`/api/accounts/${id}`, data);
  }

  static async deleteAccount(id: number) {
    return this.delete(`/api/accounts/${id}`);
  }

  // Métodos específicos para trades
  static async getTrades(all = false) {
    const endpoint = all ? '/api/trades?all=true' : '/api/trades';
    return this.get(endpoint);
  }

  static async getTrade(id: number) {
    return this.get(`/api/trades/${id}`);
  }

  static async createTrade(data: any) {
    return this.post('/api/trades', data);
  }

  static async updateTrade(id: number, data: any) {
    return this.put(`/api/trades/${id}`, data);
  }

  static async deleteTrade(id: number) {
    return this.delete(`/api/trades/${id}`);
  }

  // Webhook para trades (simulación desde frontend)
  static async sendTradeWebhook(data: any) {
    const response = await fetch(`${apiBaseUrl}/api/webhook/trade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Métodos específicos para notificaciones
  static async getNotifications(all = false) {
    const endpoint = all ? '/api/notifications?all=true' : '/api/notifications';
    return this.get(endpoint);
  }

  static async markNotificationAsRead(id: number) {
    return this.put(`/api/notifications/${id}`, { is_read: true });
  }

  static async deleteNotification(id: number) {
    return this.delete(`/api/notifications/${id}`);
  }

  // Métodos específicos para reglas de riesgo
  static async getRiskRules(all = false) {
    const endpoint = all ? '/api/risk-rules?all=true' : '/api/risk-rules';
    return this.get(endpoint);
  }

  static async getRiskRule(id: number) {
    return this.get(`/api/risk-rules/${id}`);
  }

  static async createRiskRule(data: any) {
    return this.post('/api/risk-rules', data);
  }

  static async updateRiskRule(id: number, data: any) {
    return this.put(`/api/risk-rules/${id}`, data);
  }

  static async deleteRiskRule(id: number) {
    return this.delete(`/api/risk-rules/${id}`);
  }

  // Métodos específicos para incidentes
  static async getIncidents(all = false) {
    const endpoint = all ? '/api/incidents?all=true' : '/api/incidents';
    return this.get(endpoint);
  }

  static async getIncident(id: number) {
    return this.get(`/api/incidents/${id}`);
  }

  // Métodos específicos para evaluación de riesgos
  static async evaluateTradeRisk(tradeId: number) {
    return this.post(`/api/risk-evaluation/trade/${tradeId}`, {});
  }

  static async evaluateAccountRisk(accountId: number) {
    return this.post(`/api/risk-evaluation/account/${accountId}`, {});
  }

  // Métodos específicos para tipos de reglas y acciones
  static async getRuleTypes() {
    return this.get('/api/rule-types');
  }

  static async getRuleActions() {
    return this.get('/api/rule-actions');
  }
}