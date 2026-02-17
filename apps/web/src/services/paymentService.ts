import { apiClient } from './apiClient';

export type PaymentType = 'PIX' | 'TED' | 'BOLETO' | 'DARF';
export type PaymentStatus = 'PROCESSANDO' | 'CONCLUIDO' | 'FALHOU' | 'CANCELADO';

export interface PixPaymentRequest {
  readonly type: 'PIX';
  readonly amount: number;
  readonly pixKey: string;
  readonly pixKeyType: string;
  readonly description?: string;
}

export interface TedPaymentRequest {
  readonly type: 'TED';
  readonly amount: number;
  readonly beneficiaryName: string;
  readonly beneficiaryDocument: string;
  readonly bankCode: string;
  readonly agency: string;
  readonly account: string;
  readonly accountType: 'CORRENTE' | 'POUPANCA';
  readonly description?: string;
}

export interface BoletoPaymentRequest {
  readonly barCode: string;
  readonly amount?: number;
  readonly scheduledDate?: string;
  readonly description?: string;
}

export interface DarfPaymentRequest {
  readonly cnpjCpf: string;
  readonly revenueCode: string;
  readonly dueDate: string;
  readonly description: string;
  readonly companyName: string;
  readonly assessmentPeriod: string;
  readonly principalAmount: number;
  readonly reference: string;
  readonly companyPhone?: string;
  readonly fineAmount?: number;
  readonly interestAmount?: number;
}

export interface PixChargeRequest {
  readonly amount: number;
  readonly expirationInSeconds?: number;
  readonly additionalInfo?: string;
  readonly payerName?: string;
  readonly payerDocument?: string;
}

export interface Payment {
  readonly _id: string;
  readonly transactionId: string;
  readonly type: PaymentType;
  readonly amount: number;
  readonly status: PaymentStatus;
  readonly accountId: string;
  readonly companyId: string;
  readonly beneficiary: {
    readonly name: string;
    readonly document: string;
    readonly pixKey?: string;
    readonly bankCode?: string;
    readonly agency?: string;
    readonly account?: string;
    readonly accountType?: string;
  };
  readonly scheduledTo: string;
  readonly scheduledDate?: string;
  readonly authenticationCode?: string;
  readonly barCode?: string;
  readonly description?: string;
  readonly errorMessage?: string;
  readonly processedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PixCharge {
  readonly _id: string;
  readonly txid: string;
  readonly status: string;
  readonly qrCode: string;
  readonly pixCopiaECola: string;
  readonly amount: number;
  readonly accountId: string;
  readonly companyId: string;
  readonly expiresAt: string;
  readonly payerName?: string;
  readonly payerDocument?: string;
  readonly additionalInfo?: string;
  readonly paidAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PaymentFilters {
  readonly type?: PaymentType;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly status?: string;
}

interface ApiListResponse<T> {
  readonly success: boolean;
  readonly data: T[];
  readonly count: number;
}

interface ApiSingleResponse<T> {
  readonly success: boolean;
  readonly data: T;
}

const BASE_PATH = '/banking/accounts';

export async function createPixPayment(
  accountId: string,
  data: PixPaymentRequest,
): Promise<Payment> {
  const response = await apiClient.post<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payment/pix`,
    data,
  );
  return response.data.data;
}

export async function createTedPayment(
  accountId: string,
  data: TedPaymentRequest,
): Promise<Payment> {
  const response = await apiClient.post<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payment/ted`,
    data,
  );
  return response.data.data;
}

export async function createBoletoPayment(
  accountId: string,
  data: BoletoPaymentRequest,
): Promise<Payment> {
  const response = await apiClient.post<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payment/boleto`,
    data,
  );
  return response.data.data;
}

export async function createDarfPayment(
  accountId: string,
  data: DarfPaymentRequest,
): Promise<Payment> {
  const response = await apiClient.post<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payment/darf`,
    data,
  );
  return response.data.data;
}

export async function createPixCharge(
  accountId: string,
  data: PixChargeRequest,
): Promise<PixCharge> {
  const response = await apiClient.post<ApiSingleResponse<PixCharge>>(
    `${BASE_PATH}/${accountId}/pix/charge`,
    data,
  );
  return response.data.data;
}

export async function getPaymentById(accountId: string, paymentId: string): Promise<Payment> {
  const response = await apiClient.get<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payments/${paymentId}`,
  );
  return response.data.data;
}

export async function listPayments(
  accountId: string,
  filters?: PaymentFilters,
): Promise<Payment[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.startDate) params.set('startDate', filters.startDate);
  if (filters?.endDate) params.set('endDate', filters.endDate);
  if (filters?.status) params.set('status', filters.status);

  const queryString = params.toString();
  const suffix = queryString ? `?${queryString}` : '';
  const url = `${BASE_PATH}/${accountId}/payments${suffix}`;

  const response = await apiClient.get<ApiListResponse<Payment>>(url);
  return response.data.data;
}

export async function cancelPayment(accountId: string, paymentId: string): Promise<Payment> {
  const response = await apiClient.delete<ApiSingleResponse<Payment>>(
    `${BASE_PATH}/${accountId}/payments/${paymentId}`,
  );
  return response.data.data;
}

export async function listPixCharges(accountId: string): Promise<PixCharge[]> {
  const response = await apiClient.get<ApiListResponse<PixCharge>>(
    `${BASE_PATH}/${accountId}/pix/charges`,
  );
  return response.data.data;
}

export async function cancelPixCharge(accountId: string, txid: string): Promise<PixCharge> {
  const response = await apiClient.delete<ApiSingleResponse<PixCharge>>(
    `${BASE_PATH}/${accountId}/pix/charge/${txid}`,
  );
  return response.data.data;
}
