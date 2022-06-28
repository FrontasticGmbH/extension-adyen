import { ActionContext, Request, Response } from '@frontastic/extension-types/src/ts/index';
import { CreateSessionDTO, CreateSessionPayload } from '../Session';
import AdyenApi from '../BaseApi';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../../types/account/Account';
import { getLocale } from '../utils/Request';

export const createSession = async (request: Request, actionContext: ActionContext) => {
  const api = new AdyenApi(actionContext.frontasticContext.project.configuration.payment.adyen);

  const account = (request.sessionData?.account ?? {}) as Account;
  const sessionDTO = JSON.parse(request.body) as CreateSessionDTO;
  const sessionPayload = {
    reference: uuidv4(),
    shopperEmail: account.email,
    shopperLocale: getLocale(request),
    shopperReference: account.accountId,
    ...sessionDTO,
  } as CreateSessionPayload;

  const data = await api.createSession(sessionPayload);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };
  return response;
};

export const updateOrder = async (request: Request, actionContext: ActionContext) => {
  const sessionId = request.query?.sessionId;
  const type = request.query?.type;
  const resultCode = request.query?.resultCode;

  if (resultCode === 'authorised') {
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: request.sessionData,
  };
  return response;
};

export const notifications = async (request: Request, actionContext: ActionContext) => {
  console.log('NOTIFICATIONS INCOMMING');
  console.log(JSON.stringify(request.body));

  /*
  originalReference=
  &reason=null
  &additionalData.checkoutSessionId=CSBD9C24B5158B8E17
  &merchantAccountCode=FrontasticGmbHECOM
  &eventCode=AUTHORISATION
  &operations
*/

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
