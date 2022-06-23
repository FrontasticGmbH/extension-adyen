import axios, { AxiosInstance } from 'axios';
import { AdyenMapper } from './mappers';
import { CreateSessionPayload, SessionResponse } from './Session';

interface AdyenConfig {
  apiKey: string;
  merchantAccount: string;
  baseUrl: string;
  clientKey: string;
  originKeys: string[];
}

class BaseApi {
  private instance: AxiosInstance;

  constructor(config: AdyenConfig) {
    //Axios instance
    this.instance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'x-API-key': config.apiKey,
        'content-type': 'application/json',
      },
    });

    //Request interceptor
    this.instance.interceptors.request.use((req) => {
      req.data = { ...(req.data || {}), merchantAccount: config.merchantAccount };
      return req;
    });
  }

  async createSession(payload: CreateSessionPayload) {
    const response = await this.instance.post<SessionResponse>('/sessions', payload);
    return AdyenMapper.adyenSessionResponesToSessionResponse(response.data);
  }
}

export default BaseApi;
