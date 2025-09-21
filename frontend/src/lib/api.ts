// Simple API helper for OTP backend
export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000').toString().replace(/\/$/, '');

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch (_) {
    // ignore
  }
  if (!res.ok) {
    return data ?? { error: 'Request failed' };
  }
  return data;
}

export async function sendOtp(phone: string, channel: 'sms' | 'whatsapp' = 'sms') {
  return request('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, channel }),
  });
}

export async function verifyOtp(phone: string, code: string) {
  return request('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}
