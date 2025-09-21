import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const RAW_ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';
const ALLOWED_ORIGINS = RAW_ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';

let client = null;
if (
  TWILIO_ACCOUNT_SID.startsWith('AC') &&
  Boolean(TWILIO_AUTH_TOKEN) &&
  TWILIO_VERIFY_SERVICE_SID.startsWith('VA')
) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
} else {
  console.warn('[WARN] Twilio env vars missing or invalid. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID.');
}

const app = express();

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (like curl/postman) with no origin
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'otp-backend', time: new Date().toISOString() });
});

// Helper validation
const isE164 = (phone) => /^\+[1-9]\d{1,14}$/.test(phone);
const isOtpCode = (code) => /^\d{6}$/.test(code);

// Send OTP using Twilio Verify
// Body: { phone: "+91XXXXXXXXXX", channel?: "sms" | "whatsapp" }
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({ error: 'Server not configured: Missing Twilio credentials' });
    }

    const { phone, channel } = req.body || {};
    const deliveryChannel = channel === 'whatsapp' ? 'whatsapp' : 'sms';

    if (!phone || !isE164(phone)) {
      return res.status(400).json({ error: 'Invalid phone. Provide E.164 format, e.g. +919876543210' });
    }

    const verify = await client.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: deliveryChannel });

    return res.status(200).json({ status: verify.status, to: verify.to, channel: deliveryChannel });
  } catch (err) {
    console.error('send-otp error:', err?.message || err);
    const code = err?.status || 500;
    return res.status(code).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP code
// Body: { phone: "+91XXXXXXXXXX", code: "123456" }
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({ verified: false, error: 'Server not configured: Missing Twilio credentials' });
    }

    const { phone, code } = req.body || {};

    if (!phone || !isE164(phone)) {
      return res.status(400).json({ error: 'Invalid phone. Provide E.164 format, e.g. +919876543210' });
    }
    if (!code || !isOtpCode(code)) {
      return res.status(400).json({ error: 'Invalid code. Provide 6-digit numeric code' });
    }

    const check = await client.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    if (check.status === 'approved') {
      // In a real app, you would create a session/JWT here
      return res.status(200).json({ verified: true });
    }

    return res.status(400).json({ verified: false, error: 'Invalid or expired code' });
  } catch (err) {
    console.error('verify-otp error:', err?.message || err);
    const code = err?.status || 500;
    return res.status(code).json({ verified: false, error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`OTP backend listening on http://localhost:${PORT}`);
});
