"use client"

import { ToastProvider, toast } from "@heroui/react"

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider placement="top end" />
      {children}
    </>
  )
}

type ToastSuccessOptions = NonNullable<Parameters<typeof toast.success>[1]>

export const authNotifications = {
  loginSuccess: (name?: string) => ({
    title: "Berhasil masuk",
    options: {
      description: name ? `Selamat datang kembali, ${name}!` : "Selamat datang kembali!",
    } as ToastSuccessOptions,
  }),
  logoutSuccess: () => ({
    title: "Berhasil keluar",
    options: {
      description: "Kamu telah berhasil keluar dari akun.",
    } as ToastSuccessOptions,
  }),
  registerSuccess: () => ({
    title: "Pendaftaran berhasil",
    options: {
      description: "Akun kamu telah berhasil dibuat.",
    } as ToastSuccessOptions,
  }),
}

export const profileNotifications = {
  updateSuccess: () => ({
    title: "Profil berhasil diperbarui",
  }),
  updateError: (message?: string) => ({
    title: "Gagal memperbarui profil",
    options: {
      description: message,
    } as ToastSuccessOptions,
  }),
  avatarSuccess: () => ({
    title: "Foto profil berhasil diperbarui",
  }),
  avatarError: (message?: string) => ({
    title: "Gagal mengunggah foto",
    options: {
      description: message,
    } as ToastSuccessOptions,
  }),
}

export function notifyError({ title, options }: { title: string; options?: ToastSuccessOptions }) {
  toast.danger(title, options)
}

export function notifySuccess({ title, options }: { title: string; options?: ToastSuccessOptions }) {
  toast.success(title, options)
}