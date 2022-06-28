import { CreateSessionDTO, CreateSessionPayload, PaymentDetails } from '../Session';
import AdyenApi from '../BaseApi';
import { CartApi } from '../../commerce-commercetools/apis/CartApi';
import { EmailApi } from '../../commerce-commercetools/apis/EmailApi';
import { Guid } from '../utils/Guid';
import { getLocale } from '../utils/Request';
import { CartFetcher } from '../utils/CartFetcher';
import { Account } from '../../../types/account/Account';
import { URLSearchParams } from 'url';
import { ActionContext, Request } from "@frontastic/extension-types";
import { Response } from "@frontastic/extension-types/src/ts/index";

export const createSession = async (request: Request, actionContext: ActionContext) => {
  const adyenApi = new AdyenApi(actionContext.frontasticContext.project.configuration.payment.adyen);

  const account = (request.sessionData?.account ?? {}) as Account;
  const sessionDTO = JSON.parse(request.body) as CreateSessionDTO;
  const sessionPayload = {
    reference: Guid.newGuid(),
    shopperEmail: account.email,
    shopperLocale: getLocale(request),
    shopperReference: account.accountId,
    ...sessionDTO,
  } as CreateSessionPayload;

  const data = await adyenApi.createSession(sessionPayload);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };
  return response;
};

export const checkout = async (request: Request, actionContext: ActionContext) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
  const emailApi = new EmailApi(actionContext.frontasticContext.project.configuration.smtp);
  const adyenApi = new AdyenApi(actionContext.frontasticContext.project.configuration.payment.adyen);

  const { account } = JSON.parse(request.body);

  const payload = {
    details: {
      redirectResult: JSON.parse(request.body).redirectResult
    }
  } as PaymentDetails;

  const data = await adyenApi.paymentDetails(payload);

  if (data.resultCode === 'Authorised') {
    let cart = await CartFetcher.fetchCart(request, actionContext);
    cart = await cartApi.order(cart);

    if (cart) await emailApi.sendPaymentConfirmationEmail(account);

    // Unset the cartId
    const cartId: string = undefined;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        cartId,
      },
    };
    return response;
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };
  return response;
};

export const notifications = async (request: Request, actionContext: ActionContext) => {
  console.log('NOTIFICATIONS INCOMMING');
  const params = new URLSearchParams(request.body);

  console.log('eventCode: ', params.get('eventCode'));
  console.log('pspReference: ', params.get('pspReference'));
  console.log('merchantReference: ', params.get('merchantReference'));

/*
  "originalReference=&
  reason=null&
  additionalData.checkoutSessionId=CSA10244BE25969113&
  merchantAccountCode=FrontasticGmbHECOM&
  eventCode=AUTHORISATION&
  operations=REFUND&
  success=true&
  paymentMethod=eps&
  currency=EUR&
  pspReference=BHTZJPN5F4BLNK82&
  merchantReference=b5d60b11-7308-4c67-af1c-09c485e41e63&
  value=7650&
  live=false&
  eventDate=2022-06-20T07%3A36%3A15.00Z"


  //const notificationRequestItems = JSON.parse(request.body).notificationItems;

  //notificationRequestItems?.forEach(({ NotificationRequestItem }: any) => {
  //    console.info("Received webhook notification", NotificationRequestItem);

  /*
    if (validator.validateHMAC(NotificationRequestItem, process.env.HMAC_KEY)) {
      if (NotificationRequestItem.success === "true") {
        // Process the notification based on the eventCode
        if (NotificationRequestItem.eventCode === "AUTHORISATION"){
          const payment = paymentStore[NotificationRequestItem.merchantReference];
          if(payment){
            payment.status = "Authorised";
            payment.paymentRef = NotificationRequestItem.pspReference;
          }
        }
        else if (NotificationRequestItem.eventCode === "CANCEL_OR_REFUND") {
          const payment = findPayment(NotificationRequestItem.pspReference);
          if(payment){
            console.log("Payment found: ", JSON.stringify(payment));
            // update with additionalData.modification.action
            if (
              "modification.action" in NotificationRequestItem.additionalData &&
              "refund" === NotificationRequestItem.additionalData["modification.action"]
            ) {
              payment.status = "Refunded";
            } else {
              payment.status = "Cancelled";
            }
          }
        }
        else {
          console.info("skipping non actionable webhook");
        }
      }
    }
    else {
        // invalid hmac: do not send [accepted] response
        console.log("Invalid HMAC signature: " + notification);
        res.status(401).send('Invalid HMAC signature');
    }*/
  //});

  const response: Response = {
    statusCode: 200,
    body: '[accepted]',
    sessionData: request.sessionData,
  };
  return response;
};
