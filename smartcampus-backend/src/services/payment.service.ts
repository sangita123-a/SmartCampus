export interface PaymentOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'stripe' | 'cash';
  rawPayload?: any;
}

export interface IPaymentAdapter {
  createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(payload: any): Promise<{ success: boolean; transactionId: string }>;
}

export class RazorpayAdapter implements IPaymentAdapter {
  async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const mockOrderId = `rzp_order_${Date.now()}`;
    return {
      orderId: mockOrderId,
      amount: params.amount,
      currency: params.currency,
      provider: 'razorpay',
      rawPayload: { id: mockOrderId, entity: 'order' }
    };
  }

  async verifyPayment(payload: any): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: payload.razorpay_payment_id || `rzp_pay_${Date.now()}`
    };
  }
}

export class StripeAdapter implements IPaymentAdapter {
  async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const mockIntentId = `pi_stripe_${Date.now()}`;
    return {
      orderId: mockIntentId,
      amount: params.amount,
      currency: params.currency,
      provider: 'stripe',
      rawPayload: { client_secret: `${mockIntentId}_secret_demo` }
    };
  }

  async verifyPayment(payload: any): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: payload.payment_intent_id || `pi_stripe_${Date.now()}`
    };
  }
}

export class CashAdapter implements IPaymentAdapter {
  async createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const mockCashId = `CASH_${Date.now()}`;
    return {
      orderId: mockCashId,
      amount: params.amount,
      currency: params.currency,
      provider: 'cash',
      rawPayload: { mode: 'MANUAL_CASH' }
    };
  }

  async verifyPayment(payload: any): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: payload.receiptNumber || `CASH_TXN_${Date.now()}`
    };
  }
}

export class PaymentService {
  private static adapters: Record<string, IPaymentAdapter> = {
    razorpay: new RazorpayAdapter(),
    stripe: new StripeAdapter(),
    cash: new CashAdapter()
  };

  public static getAdapter(provider: string = 'razorpay'): IPaymentAdapter {
    const adapter = this.adapters[provider.toLowerCase()];
    if (!adapter) {
      throw new Error(`Unsupported payment provider adapter: ${provider}`);
    }
    return adapter;
  }
}

export const paymentService = {
  recordPayment: async (data: any) => {
    return { success: true, transactionId: `TXN_${Date.now()}`, data };
  },
  collectPayment: async (data: any, _user?: any) => {
    return { success: true, transactionId: `TXN_${Date.now()}`, data };
  },
  listPayments: async (_collegeId: any, _query: any) => {
    return { data: [], total: 0, page: 1, limit: 10 };
  },
  getPaymentById: async (id: string, _collegeId: any) => {
    return { id, status: 'PAID' };
  }
};
