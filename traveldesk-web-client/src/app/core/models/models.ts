// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  agencyName: string;
  fullName: string;
  email: string;
  password: string;
}

export interface AcceptInviteRequest {
  token: string;
  fullName: string;
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthMeResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}

export interface MessageResponse {
  message: string;
}

// ─── Account ──────────────────────────────────────────────────────────────────
export interface AccountRequest {
  fullName: string;
  email: string;
}

export interface AccountResponse {
  fullName: string;
  email: string;
  status: string;
}

// ─── Agency Settings ──────────────────────────────────────────────────────────
export interface AgencySettingsRequest {
  agencyName: string;
  currency: string;
  timeZone: string;
}

export interface AgencySettingsResponse {
  agencyName: string;
  currency: string;
  timeZone: string;
}

// ─── Commission Settings ──────────────────────────────────────────────────────
export interface CommissionSettingsRequest {
  commissionType: string;
  commissionValue: number;
}

export interface CommissionSettingsResponse {
  commissionType: string;
  commissionValue: number;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export interface ThemeRequest {
  mode: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface ThemeResponse {
  mode: string;
  primaryColor: string;
  secondaryColor: string;
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export interface TeamMemberRequest {
  role: string;
  status: string;
}

export interface TeamMemberResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface TeamInviteRequest {
  email: string;
  role: string;
}

// ─── Customer (antes Client) ───────────────────────────────────────────────────
export interface CustomerRequest {
  fullName: string;
  email: string;
  phone: string;
}

export interface CustomerResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

// Alias para compatibilidad
export type Client = CustomerResponse;
export type CreateClientDto = CustomerRequest;

// ─── Supplier ─────────────────────────────────────────────────────────────────
export type ServiceType =
  | "AIRLINE"
  | "HOTEL"
  | "TRANSPORT"
  | "TOUR_OPERATOR"
  | "INSURANCE"
  | "OTHER";

export type Currency = "USD" | "EUR";

export interface SupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  serviceType: ServiceType;
  currency: Currency;
  country?: string;
}

export interface SupplierResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  serviceType: ServiceType;
  currency: Currency;
  country?: string;
}

// Alias para compatibilidad
export type Supplier = SupplierResponse;
export type CreateSupplierDto = SupplierRequest;

// ─── Sale ─────────────────────────────────────────────────────────────────────
export interface SaleRequest {
  customerId: string;
  supplierId: string;
  destination: string;
  amount: number;
  status: string;
}

export interface SaleResponse {
  id: string;
  customerId: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  destination: string;
  amount: number;
  status: string;
}

// Alias para compatibilidad
export type Sale = SaleResponse;
export type CreateSaleDto = SaleRequest;

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface BookingRequest {
  customerId: string;
  supplierId: string;
  reference: string;
  passengerName: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  status: string;
}

export interface BookingResponse {
  id: string;
  customerId: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  reference: string;
  passengerName: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  status: string;
}

// Alias para compatibilidad con ServiceBooking
export type ServiceBooking = BookingResponse;
export type CreateServiceDto = Omit<BookingRequest, 'returnDate'> & {
  name: string;
  currency: Currency;
  netCost: number;
  salePrice: number | null;
  travelDate: string;
  notes?: string;
};

// ─── Exchange Rate ────────────────────────────────────────────────────────────
export interface ExchangeRateResponse {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStatsResponse {
  totalSales: number;
  totalBookings: number;
  totalCustomers: number;
  totalSuppliers: number;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
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
  search: string;
  status: string;
  customerId: string;
  supplierId: string;
}
