// Tipos para el usuario
export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
}

// Tipos para cuentas
export interface Account {
  id: number;
  owner_id: number;
  login: number;
  trading_status: 'enable' | 'disable';
  status: 'enable' | 'disable';
  created_at: string;
  updated_at: string;
  owner?: User;
  trades?: Trade[];
  incidents?: Incident[];
}

// Tipos para trades
export interface Trade {
  id: number;
  account_id: number;
  type: 'BUY' | 'SELL';
  volume: string;
  open_time: string;
  open_price: string;
  close_time?: string;
  close_price?: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  account?: Account;
}

// Tipos para notificaciones
export interface Notification {
  id: number;
  user_id: number;
  mensaje: string;
  metadata?: {
    rule_id?: number;
    incident_id?: number;
    account_id?: number;
    severity?: 'Hard' | 'Soft';
    action?: 'account_disabled' | 'trading_disabled' | 'trades_closed';
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// Tipos para reglas de riesgo
export interface RiskRule {
  id: number;
  name: string;
  description: string;
  severity: 'Hard' | 'Soft';
  is_active: boolean;
  rule_type: RuleType;
  actions: RuleAction[];
  parameters?: any;
  created_at: string;
  updated_at: string;
}

export interface RuleType {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface RuleAction {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// Tipos para incidentes
export interface Incident {
  id: number;
  account_id: number;
  risk_rule_id: number;
  trade_id?: number;
  count: number;
  triggered_value: string;
  is_executed: boolean;
  created_at: string;
  updated_at: string;
  account?: Account;
  risk_rule?: RiskRule;
  trade?: Trade;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface WebhookTradeResponse {
  success: boolean;
  message: string;
  trade_id: number;
  violations_detected: number;
  violations: Array<{
    rule: string;
    severity: 'Hard' | 'Soft';
    incident_id: number;
  }>;
}

// Tipos para formularios
export interface CreateAccountForm {
  owner_id: number;
  login: number;
  trading_status: 'enable' | 'disable';
  status: 'enable' | 'disable';
}

export interface CreateTradeForm {
  account_login: number;
  type: 'BUY' | 'SELL';
  volume: number;
  open_time: string;
  open_price: number;
  status: 'open' | 'closed';
  close_time?: string;
  close_price?: number;
}

export interface CreateRiskRuleForm {
  name: string;
  description: string;
  severity: 'Hard' | 'Soft';
  is_active: boolean;
  rule_type_id: number;
  action_ids: number[];
  parameters: any;
}

// Tipos para el dashboard
export interface DashboardStats {
  totalAccounts: number;
  activeAccounts: number;
  totalTrades: number;
  openTrades: number;
  totalIncidents: number;
  unreadNotifications: number;
  activeRules: number;
}

export interface RiskDashboard {
  account: Account;
  incidents: Incident[];
  notifications: Notification[];
  stats: DashboardStats;
}