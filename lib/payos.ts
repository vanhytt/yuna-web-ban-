import { PayOS } from "@payos/node";

let _payOS: PayOS | null = null;

export function getPayOS(): PayOS {
  if (!_payOS) {
    if (!process.env.PAYOS_CLIENT_ID) {
      throw new Error("PAYOS_CLIENT_ID chưa được cấu hình trong .env.local");
    }
    if (!process.env.PAYOS_API_KEY) {
      throw new Error("PAYOS_API_KEY chưa được cấu hình trong .env.local");
    }
    if (!process.env.PAYOS_CHECKSUM_KEY) {
      throw new Error("PAYOS_CHECKSUM_KEY chưa được cấu hình trong .env.local");
    }
    _payOS = new PayOS({
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: process.env.PAYOS_API_KEY,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY,
    });
  }
  return _payOS;
}

export default getPayOS;