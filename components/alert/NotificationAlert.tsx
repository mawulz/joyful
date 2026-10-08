"use client"

import { Alert, CloseButton } from "@heroui/react"

export type NotificationStatus = "success" | "danger"

export interface NotificationAlertProps {
  status: NotificationStatus
  title: string
  description?: string
  onClose?: () => void
}

export function NotificationAlert({
  status,
  title,
  description,
  onClose,
}: NotificationAlertProps) {
  return (
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description && <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
      <CloseButton onClick={onClose} />
    </Alert>
  )
}
