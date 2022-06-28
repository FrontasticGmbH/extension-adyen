import { SessionResponse, PaymentDetailsResponse } from '@Types/adyen/Session';

export class AdyenMapper {
  static adyenSessionResponseToSessionResponse(sessionResponse: SessionResponse) {
    return sessionResponse;
  }

  static adyenPaymentDetailsToDetails(paymentDetails: PaymentDetailsResponse) {
    return paymentDetails;
  }
}