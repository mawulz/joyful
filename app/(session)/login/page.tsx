"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";
import { toast } from "@heroui/react";
import { authNotifications } from "@/components/alert/NotificationProvider";

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      const result = await signIn.email({
        email,
        password
      })

      if (result.error) {
        setError(result.error.message ?? "Invalid email or password")
      } else {
        const { title, options } = authNotifications.loginSuccess(result.data?.user?.name)
        toast.success(title, options)
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="min-w-300px w-full text-center border-2 border-gray-300 rounded-2xl px-10 bg-background">
        <h1 className="text-gray-900 text-2xl mt-10 font-semibold">Selamat Datang Kembali!</h1>
        <p className="text-gray-500 text-sm mt-2">Masuk untuk mulai berkontribusi</p>
        <div className="mt-4 flex-col space-y-1">
          <span className="flex self-start font-medium">Email</span>
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-xl pl-6 gap-2 pr-2">
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              className="border-none outline-none ring-0 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
        </div>
        <div className="mt-4 flex-col space-y-1">
          <span className="flex self-start font-medium">Password</span>
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-xl pl-6 gap-2 pr-2">
            <input
              type="password"
              name="password"
              placeholder="Masukkan kata sandi"
              className="border-none outline-none ring-0 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
        </div>
        { error && (
            <div className="p-2 mt-2 text-base rounded-xl text-red-800 bg-red-100">
                {error}
            </div>
            )
        }
        <div className="mt-3 text-right">
          <Link href="#" className="text-primary hover:underline text-sm font-medium">
            Lupa kata sandi?
          </Link>
        </div>
        <button disabled={loading} type="submit" className="mt-4 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity">
          {loading ? "Memuat..." : "Masuk"}
        </button>
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Belum punya akun?
          <Link href="/register" className="text-primary hover:underline font-medium"> Daftar</Link>
        </p>
      </form>
    </div>
  );
}