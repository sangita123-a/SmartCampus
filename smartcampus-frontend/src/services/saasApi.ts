import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const saasApi = {
  getPlans: async () => {
    const res = await axios.get(`${API_BASE_URL}/saas/plans`);
    return res.data;
  },

  validateCoupon: async (code: string, amount: number) => {
    const res = await axios.get(`${API_BASE_URL}/saas/coupons/validate`, {
      params: { code, amount }
    });
    return res.data;
  },

  registerCollege: async (data: any) => {
    const res = await axios.post(`${API_BASE_URL}/saas/register`, data);
    return res.data;
  },

  createPaymentOrder: async (data: { amount: number; currency?: string; provider?: string; receipt?: string }) => {
    const res = await axios.post(`${API_BASE_URL}/saas/payment/create-order`, data);
    return res.data;
  },

  verifyPayment: async (data: { provider: string; payload: any; invoiceId?: string }) => {
    const res = await axios.post(`${API_BASE_URL}/saas/payment/verify`, data);
    return res.data;
  },

  getBlogPosts: async (category?: string, search?: string) => {
    const res = await axios.get(`${API_BASE_URL}/saas/blog`, {
      params: { category, search }
    });
    return res.data;
  },

  getBlogPostBySlug: async (slug: string) => {
    const res = await axios.get(`${API_BASE_URL}/saas/blog/${slug}`);
    return res.data;
  },

  submitContact: async (data: { name: string; email: string; phone?: string; college?: string; type?: string; message: string }) => {
    const res = await axios.post(`${API_BASE_URL}/saas/contact`, data);
    return res.data;
  }
};
