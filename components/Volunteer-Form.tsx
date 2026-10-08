"use client"

import { useState, SubmitEvent } from "react"

import {
  Button,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  FieldError,
  TextField,
} from "@heroui/react"

const VolunteerForm = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [field, setField] = useState("")
  const [cv, setCv] = useState<File | null>(null)
  const [cvError, setCvError] = useState("")
  const [motivation, setMotivation] = useState("")
  const isMotivationInvalid = motivation.length > 0 && motivation.length < 10
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const isFormValid =
    field !== null &&
    motivation.trim().length >= 20 &&
    cv !== null &&
    !cvError

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    
    setError("")
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    if (!cv) {
      setError("Silakan upload CV.")
      return
    }

    if (cv.size > MAX_FILE_SIZE) {
      setError("Ukuran CV tidak boleh melebihi 5 MB.")
      return
    }

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal mengirim pendaftaran.")
        return
      }
        form.reset()

        setField("")
        setMotivation("")
        setCv(null)
    } catch {
        setError("Internal server error")
    } finally {
        setLoading(false)
    }   
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-75 w-full rounded-3xl border border-black/8 bg-background px-5 pb-8 pt-8 text-left shadow-xl shadow-black/5 md:px-8 md:pb-10 md:pt-10"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Volunteer Application
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Lengkapi data berikut untuk mendaftar sebagai relawan.
        </p>
      </div>

      <div className="space-y-6">
        <Select
          isRequired
          name="field"
          placeholder="Pilih bidang yang sesuai"
          value={field || null}
          onChange={(value) => setField(value ? String(value) : "")}
        >
          <Label>Bidang Keahlian</Label>

          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>

          <Select.Popover
            className="
              data-[entering]:animate-none
              data-[exiting]:animate-none
            "
          >
            <ListBox>
              <ListBox.Item id="pengajar">
                Pengajar
              </ListBox.Item>

              <ListBox.Item id="dokumentasi">
                Dokumentasi
              </ListBox.Item>

              <ListBox.Item id="logistik-acara">
                Logistik & Acara
              </ListBox.Item>
            </ListBox>
          </Select.Popover>

          <FieldError>Pilih bidang yang sesuai</FieldError>
        </Select>

        <div className="flex flex-col gap-2">
          <TextField
            isRequired
            isInvalid={isMotivationInvalid}
            name="motivation"
            value={motivation}
            onChange={setMotivation}
          >
            <Label>Alasan Ingin Bergabung</Label>

            <TextArea
              placeholder="Tuliskan motivasi di sini"
              rows={5}
            />

            {isMotivationInvalid && (
              <FieldError>
                Alasan harus terdiri dari minimal 10 karakter.
              </FieldError>
            )}
          </TextField>
        </div>

        {/* CV Upload */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="cv">
            Upload CV
          </Label>

          <Input
            id="cv"
            type="file"
            name="cv"
            accept="application/pdf,.pdf"
            required
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null

              setCvError("")

              if (!file) {
                setCv(null)
                return
              }

              if (file.size > MAX_FILE_SIZE) {
                setCv(null)
                setCvError("Ukuran file tidak boleh melebihi 5 MB.")
                e.target.value = ""
                return
              }

              setCv(file)
            }}
            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm transition file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:border-gray-300 hover:file:bg-primary/15 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {cvError ? (
            <p className="text-sm text-danger">
              {cvError}
            </p>
          ) : (
            <Description className="text-xs text-gray-500">
              Format file PDF, maksimal 5 MB.
            </Description>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        isDisabled={!isFormValid || loading}
        className="mt-7 h-12 w-full rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "Kirim Pendaftaran"}
      </Button>
    </form>
  )
}

export default VolunteerForm