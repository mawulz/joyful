"use client"

import { useState } from "react"
import { Button, Checkbox, Input } from "@heroui/react"

const donationOptions = [
  { label: "Rp 20.000", value: 20000 },
  { label: "Rp 50.000", value: 50000 },
  { label: "Rp 100.000", value: 100000 },
]

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void
          onPending?: (result: unknown) => void
          onError?: (result: unknown) => void
          onClose?: () => void
        }
      ) => void
    }
  }
}

export default function DonationForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedAmount, setSelectedAmount] = useState<number | "other" | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [customAmountError, setCustomAmountError] = useState("")
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [agreed, setAgreed] = useState(false)

  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/\D/g, "")

    if (!numericValue) return ""

    return new Intl.NumberFormat("id-ID").format(Number(numericValue))
  }

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRupiah(e.target.value)

    setCustomAmount(formattedValue)

    if (!formattedValue) {
      setCustomAmountError("")
      return
    }

    const numericValue = parseRupiah(formattedValue)

    if (numericValue < 20000) {
      setCustomAmountError("Minimal donasi Rp 20.000.")
    } else {
      setCustomAmountError("")
    }
  }

  const parseRupiah = (value: string) => {
    return Number(value.replace(/\./g, ""))
  } 

  const handleContinue = () => {
    if (!selectedAmount) return

    if (selectedAmount === "other") {
      const amount = parseRupiah(customAmount)

      if (!customAmount) {
        setCustomAmountError("Masukkan nominal donasi.")
        return
      }

      if (amount < 20000) {
        setCustomAmountError("Minimal donasi adalah Rp 20.000.")
        return
      }
    }
    setCustomAmountError("")
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError("")

    const finalAmount =
      selectedAmount === "other" ? parseRupiah(customAmount) : selectedAmount

    if (!finalAmount) return

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: personalInfo.name,
          donorEmail: personalInfo.email,
          amount: finalAmount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || "Gagal memproses donasi. Coba lagi.")
        return
      }

      if (!window.snap) {
        setSubmitError("Payment gateway belum siap. Muat ulang halaman.")
        return
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          // Don't trust this to mark payment complete — the notification
          // webhook is the source of truth. This is just UI feedback.
          setStep(1)
          setSelectedAmount(null)
          setCustomAmount("")
          setPersonalInfo({ name: "", email: "" })
          setAgreed(false)
        },
        onPending: () => {
          // e.g. bank transfer / VA chosen — payment not yet confirmed
        },
        onError: () => {
          setSubmitError("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: () => {
          setSubmitError("Kamu menutup jendela pembayaran sebelum selesai.")
        },
      })
    } catch (err) {
      console.error(err)
      setSubmitError("Terjadi kesalahan jaringan. Coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[30px] border-2 border-gray-300 bg-[#EFEFEF] p-6 md:p-7">
      {step === 1 ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-black">
            Pilih Jumlah Donasi
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {donationOptions.map((option) => (
              <label
                key={option.value}
                className={`flex min-h-16 cursor-pointer items-center rounded-xl border px-3 transition ${
                  selectedAmount === option.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-gray-200 bg-white hover:border-primary/40"
                }`}
              >
                <input
                  type="radio"
                  name="donationAmount"
                  value={option.value}
                  checked={selectedAmount === option.value}
                  onChange={() => setSelectedAmount(option.value)}
                  className="sr-only"
                />

                <span className="text-sm font-medium text-black">
                  {option.label}
                </span>
              </label>
            ))}

            <label
              className={`flex min-h-[64px] cursor-pointer items-center rounded-xl border px-3 transition ${
                selectedAmount === "other"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-gray-200 bg-white hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                name="donationAmount"
                value="other"
                checked={selectedAmount === "other"}
                onChange={() => setSelectedAmount("other")}
                className="sr-only"
              />

              <span className="text-sm font-medium text-black">
                Nominal Lainnya
              </span>
            </label>
          </div>

            <div className="mt-4 min-h-13.5">
                {selectedAmount === "other" && (
                  <>
                    <div
                      className={`flex h-[54px] w-full items-center rounded-xl border bg-white px-4 transition ${
                        customAmountError
                          ? "border-red-500"
                          : "border-gray-200 focus-within:border-primary"
                      }`}
                    >
                      <span className="mr-2 shrink-0 text-sm font-medium text-gray-600">
                        Rp
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={handleCustomAmount}
                        placeholder="Masukkan nominal"
                        // variant="primary"
                        className="h-full focus:outline-0 flex-1 border-0 shadow-none bg-transparent p-0 text-sm"
                      />
                    </div>
                    {customAmountError && (
                      <p className="mt-1 px-1 text-xs text-red-500">
                        {customAmountError}
                      </p>
                    )}
                  </>
                )}
            </div>

          <Button
            fullWidth
            onPress={handleContinue}
            isDisabled={
              !selectedAmount ||
              (selectedAmount === "other" && !customAmount)
            }
            className="mt-9 h-11 rounded-full bg-primary text-base font-medium text-white hover:brightness-110"
          >
            Lanjutkan
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="mb-3 text-lg font-semibold text-black">
            Informasi Personal
          </h2>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block px-1 text-sm font-medium text-black"
              >
                Nama Lengkap
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan Nama Lengkap"
                value={personalInfo.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPersonalInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                    }))
                }
                required
                variant="primary"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block px-1 text-sm font-medium text-black"
              >
                Email
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan Email"
                value={personalInfo.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPersonalInfo((prev) => ({
                    ...prev,
                    email: e.target.value,
                    }))
                }
                required
                variant="primary"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          <Checkbox
            isSelected={agreed}
            onChange={setAgreed}
            variant="primary"
            className="mt-12 items-start"
            id="custom"
          >
            <Checkbox.Content>
              <Checkbox.Control className="bg-white before:bg-primary">
                <Checkbox.Indicator className="**:data-[slot=checkbox-default-indicator--checkmark]:text-white" />
              </Checkbox.Control>
              <span className="text-xs">
               Saya setuju untuk mengizinkan Joyful menyimpan data saya dan
               menghubungi saya melalui telepon, email, dan WhatsApp untuk pembaruan
              </span>
            </Checkbox.Content>
          </Checkbox>

          {submitError && (
            <p className="mt-3 px-1 text-xs text-red-500">{submitError}</p>
          )}

          <Button
            type="submit"
            fullWidth
            isDisabled={
              !personalInfo.name ||
              !personalInfo.email ||
              !agreed ||
              isSubmitting
            }
            className="mt-4 h-11 rounded-full bg-primary text-base font-medium text-white hover:brightness-110"
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi"}
          </Button>
        </form>
      )}
    </div>
  )
}