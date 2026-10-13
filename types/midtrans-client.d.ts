import "midtrans-client"

declare module "midtrans-client" {
  interface SnapTransactionParameters {
    credit_card?: {
      secure?: boolean
    }
    customer_details?: {
      first_name?: string
      email?: string
    }
  }

  type MidtransTransactionStatus =
    | "capture"
    | "settlement"
    | "pending"
    | "deny"
    | "cancel"
    | "expire"
    | "failure"

  type MidtransFraudStatus = "accept" | "challenge" | "deny"

  interface MidtransNotificationJson {
    transaction_id?: string
    order_id?: string
    transaction_status?: string
    fraud_status?: string
    payment_type?: string
    gross_amount?: string
    status_code?: string
    signature_key?: string
    [key: string]: unknown
  }

  interface MidtransNotificationResponse {
    transaction_id: string
    order_id: string
    gross_amount: string
    payment_type: string
    transaction_time: string
    transaction_status: MidtransTransactionStatus
    fraud_status: MidtransFraudStatus
    status_code: string
    status_message: string
    signature_key: string
    [key: string]: unknown
  }

  interface Snap {
    transaction: {
      notification(notificationJson: MidtransNotificationJson): Promise<MidtransNotificationResponse>
    }
  }

  interface CoreApi {
    transaction: {
      notification(notificationJson: MidtransNotificationJson): Promise<MidtransNotificationResponse>
    }
  }
}
