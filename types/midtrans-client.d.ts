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

  interface Snap {
    transaction: {
      notification(notificationJson: any): Promise<any>
    }
  }
  
  interface CoreApi {
    transaction: {
      notification(notificationJson: any): Promise<any>
    }
  }
}
