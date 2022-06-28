// This type is used only for adyen, and does not need to be exported
interface Amount {
  currency: string; // The currency code compliant to ISO 4217.
  value: number; // In cents
}
export interface CreateSessionDTO {
  amount: Amount;
  returnUrl: string;
  expiresAt?: string;
  applicationInfo?: string;
}

export interface CreateSessionPayload extends CreateSessionDTO {
  reference: string;
  countryCode?: string;
  shopperLocale?: string;
  shopperEmail?: string;
  shopperReference?: string;
}

export interface SessionResponse {
  id: string;
  sessionData: string;
  amount: Amount;
  countryCode?: string;
  expiresAt: string;
  merchantAccount: string;
  reference: string;
  returnUrl: string;
}

export interface PaymentDetails {
  details: {
    redirectResult: string;    
  }
}

export interface PaymentDetailsResponse {
  resultCode: string;
  pspReference: string;
}