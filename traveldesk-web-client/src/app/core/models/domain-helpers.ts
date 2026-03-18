import {
  BookingResponse,
  Currency,
  PaymentReceivedResponse,
  SaleResponse,
} from "./models";

export function getSaleClientId(sale: Partial<SaleResponse>): string {
  return sale.clientId ?? sale.customerId ?? "";
}

export function getSaleClientName(sale: Partial<SaleResponse>): string {
  return sale.clientName ?? sale.customerName ?? "Sin cliente";
}

export function getSaleTravelDate(sale: Partial<SaleResponse>): string {
  return sale.travelDate ?? sale.departureDate ?? "";
}

export function getSaleCreatedAt(sale: Partial<SaleResponse>): string {
  return sale.createdAt ?? "";
}

export function getSaleTotalAmount(sale: Partial<SaleResponse>): number {
  return Number(sale.totalAmount ?? sale.amount ?? 0);
}

export function getSaleCurrency(sale: Partial<SaleResponse>): Currency {
  return sale.currency ?? "USD";
}

export function getSaleAgentId(sale: Partial<SaleResponse>): string {
  return sale.agentId ?? sale.agent?.id ?? "";
}

export function getSalePaymentsTotal(sale: Partial<SaleResponse>): number {
  if ((sale.paymentsReceived?.length ?? 0) > 0) {
    return (sale.paymentsReceived ?? []).reduce(
      (total, payment) => total + getPaymentReceivedAmount(payment, getSaleCurrency(sale)),
      0,
    );
  }

  return Number(sale.paidAmount ?? 0);
}

export function getBookingDescription(booking: Partial<BookingResponse>): string {
  return booking.description ?? "Booking";
}

export function getBookingProvider(booking: Partial<BookingResponse>): string {
  return booking.supplierName ?? "Proveedor";
}

export function getBookingReservationCode(booking: Partial<BookingResponse>): string {
  return booking.reference ?? "";
}

export function getBookingDateIn(booking: Partial<BookingResponse>): string {
  return booking.departureDate ?? "";
}

export function getBookingDateOut(booking: Partial<BookingResponse>): string {
  return booking.returnDate ?? "";
}

export function getBookingAmount(booking: Partial<BookingResponse>): number {
  return Number(booking.originalAmount ?? booking.amount ?? 0);
}

export function getBookingCurrency(booking: Partial<BookingResponse>): Currency {
  return booking.sourceCurrency ?? booking.currency ?? "USD";
}

export function getBookingAmountInSaleCurrency(
  booking: Partial<BookingResponse>,
  saleCurrency?: Currency,
): number {
  if (booking.convertedAmount != null) {
    return Number(booking.convertedAmount);
  }

  const original = Number(booking.originalAmount ?? booking.amount ?? 0);
  const sourceCurrency = booking.sourceCurrency ?? booking.currency;
  if (!saleCurrency || !sourceCurrency || saleCurrency === sourceCurrency) {
    return original;
  }

  const rate = Number(booking.exchangeRate ?? 1);
  return original * rate;
}

export function getPaymentReceivedAmount(
  payment: Partial<PaymentReceivedResponse>,
  saleCurrency?: Currency,
): number {
  const sourceCurrency = payment.currency ?? payment.sourceCurrency;
  const amount = Number(payment.originalAmount ?? payment.amount ?? 0);

  if (saleCurrency && sourceCurrency && sourceCurrency !== saleCurrency) {
    if (payment.convertedAmount != null) {
      return Number(payment.convertedAmount);
    }

    const customRate = Number(payment.customExchangeRate ?? payment.exchangeRate ?? 1);
    return amount * customRate;
  }

  if (payment.amount != null) {
    return Number(payment.amount);
  }

  if (payment.convertedAmount != null) {
    return Number(payment.convertedAmount);
  }

  return amount;
}