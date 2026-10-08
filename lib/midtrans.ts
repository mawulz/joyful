import midtransClient from "midtrans-client"
import { IS_PRODUCTION } from "./midtrans-config"

const serverKey = process.env.MIDTRANS_SERVER_KEY
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

if (!serverKey || !clientKey) {
  throw new Error("Missing MIDTRANS_SERVER_KEY or NEXT_PUBLIC_MIDTRANS_CLIENT_KEY")
}

export const snap = new midtransClient.Snap({ isProduction: IS_PRODUCTION, serverKey, clientKey })
export const coreApi = new midtransClient.CoreApi({ isProduction: IS_PRODUCTION, serverKey, clientKey })