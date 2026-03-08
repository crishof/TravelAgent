// ─── Agency ───────────────────────────────────────────────────────────────────
export interface Agency {
  id: string;
  name: string;
  slug: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  logo?: string;
  createdAt: string;
}

export interface CreateAgencyDto {
  name: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

// ─── User / Auth ──────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'AGENT';
export type UserStatus = 'active' | 'pending' | 'inactive';

export interface User {
  id: string;
  agencyId: string;
  name: string;
  email: string;
  role: UserRole;
  commissionPct: number;      // % sobre ganancia neta de la venta
  avatar: string;             // initials, e.g. "AR"
  status: UserStatus;
  inviteToken?: string;
  createdAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  agency: Agency | null;
}

export interface InviteAgentDto {
  email: string;
  commissionPct: number;
}

export interface AcceptInviteDto {
  token: string;
  name: string;
  password: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────
export interface Client {
  id: number;
  agencyId: string;
  name: string;
  email: string;
  phone?: string;
  passport?: string;
  nationality?: string;
  notes?: string;
  createdAt?: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  passport?: string;
  nationality?: string;
  notes?: string;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export type ProviderCategory = 'Hotel' | 'Aéreo' | 'Paquete' | 'Transporte' | 'Crucero' | 'Seguro' | 'Otro';
export type Currency = 'USD' | 'EUR';

export interface Provider {
  id: number;
  agencyId: string;
  name: string;
  category: ProviderCategory;
  country: string;
  contact: string;
  currency: Currency;
  notes?: string;
}

export interface CreateProviderDto {
  name: string;
  category: ProviderCategory;
  country: string;
  contact: string;
  currency: Currency;
  notes?: string;
}

// ─── Service (Booking) ────────────────────────────────────────────────────────
export type PaymentStatus = 'Pendiente' | 'Pagado' | 'Vencido';

export interface ServiceBooking {
  id: number;
  name: string;
  providerId: number;
  currency: Currency;
  netCost: number;
  salePrice: number | null;   // null = incluido en el total general de la venta
  travelDate: string;
  payStatus: PaymentStatus;
  notes?: string;
}

export interface CreateServiceDto {
  name: string;
  providerId: number;
  currency: Currency;
  netCost: number;
  salePrice: number | null;
  travelDate: string;
  notes?: string;
}

// ─── Sale ─────────────────────────────────────────────────────────────────────
export type SaleStatus = 'Cotización' | 'Confirmada' | 'En proceso' | 'Completada' | 'Cancelada';

export interface Sale {
  id: number;
  agencyId: string;
  agentId: string;
  clientId: number;
  status: SaleStatus;
  saleCurrency: Currency;
  travelDate: string;
  createdAt: string;
  exchangeRate: number;
  saleTotal: number;          // Precio total al cliente
  notes?: string;
  services: ServiceBooking[];
}

export interface CreateSaleDto {
  clientId: number;
  agentId: string;
  status: SaleStatus;
  saleCurrency: Currency;
  travelDate: string;
  exchangeRate: number;
  saleTotal: number;
  notes?: string;
}

export interface UpdateSaleTotalDto {
  saleTotal: number;
}

// ─── Commission ───────────────────────────────────────────────────────────────
export type CommissionStatus = 'Pendiente' | 'Pagado';

export interface Commission {
  id: string;
  agentId: string;
  saleId: number;
  amount: number;
  status: CommissionStatus;
  paidAt: string | null;
  description: string;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SaleFilters {
  search: string;
  status: string;
  agentId: string;
  clientId: string;
  dateFrom: string;
  dateTo: string;
}

export interface BookingFilters {
  payStatus: string;
  providerId: string;
  clientId: string;
  agentId: string;
  dateFrom: string;
}
