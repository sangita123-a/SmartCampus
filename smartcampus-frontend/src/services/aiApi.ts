import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Get auth token helper
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const aiApi = {
  chat: async (message: string, conversationId?: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/ai/chat`,
      { message, conversationId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  predictPerformance: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/performance-prediction`, { headers: getAuthHeaders() });
    return res.data;
  },

  getAttendanceInsights: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/attendance-insights`, { headers: getAuthHeaders() });
    return res.data;
  },

  getFeeInsights: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/fee-insights`, { headers: getAuthHeaders() });
    return res.data;
  },

  suggestTimetable: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/timetable-optimization`, { headers: getAuthHeaders() });
    return res.data;
  },

  getExamInsights: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/exam-insights`, { headers: getAuthHeaders() });
    return res.data;
  },

  generateNotification: async (type: string, audience: string, details: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/ai/generate-notification`,
      { type, audience, details },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  summarizeReport: async (reportText: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/ai/summarize-report`,
      { reportText },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  naturalLanguageSearch: async (query: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/ai/search`,
      { query },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  getAnalyticsAnswer: async (question: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/ai/analytics-answer`,
      { question },
      { headers: getAuthHeaders() }
    );
    return res.data;
  },

  getUsageMetrics: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/usage`, { headers: getAuthHeaders() });
    return res.data;
  },

  getSettings: async () => {
    const res = await axios.get(`${API_BASE_URL}/ai/settings`, { headers: getAuthHeaders() });
    return res.data;
  },

  updateSettings: async (data: any) => {
    const res = await axios.put(`${API_BASE_URL}/ai/settings`, data, { headers: getAuthHeaders() });
    return res.data;
  }
};
