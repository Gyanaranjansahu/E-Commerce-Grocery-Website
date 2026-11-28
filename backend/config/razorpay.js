import { createHmac, timingSafeEqual } from "node:crypto";

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay credentials are not configured.");
    error.code = "RAZORPAY_CONFIG_MISSING";
    error.statusCode = 503;
    throw error;
  }

  return { keyId, keySecret };
}

export function getRazorpayKeyId() {
  return getCredentials().keyId;
}

export async function createRazorpayOrder({ amount, currency, receipt }) {
  const { keyId, keySecret } = getCredentials();
  let response;

  try {
    response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency, receipt }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (cause) {
    const error = new Error("Razorpay is temporarily unavailable.");
    error.code = "RAZORPAY_UNAVAILABLE";
    error.statusCode = 502;
    error.cause = cause;
    throw error;
  }

  let result;
  try {
    result = await response.json();
  } catch (cause) {
    const error = new Error("Razorpay returned an invalid response.");
    error.code = "RAZORPAY_INVALID_RESPONSE";
    error.statusCode = 502;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Razorpay could not create the payment order.");
    error.code = "RAZORPAY_API_ERROR";
    error.statusCode = 502;
    throw error;
  }

  return result;
}

export function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) {
    return false;
  }

  const { keySecret } = getCredentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, "hex");

  return expected.length === received.length && timingSafeEqual(expected, received);
}
