"use client";

import Link from "next/link";
import { Checkbox } from "@heroui/react";
import React, { useState } from "react";
import { signUp } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import { authNotifications } from "@/components/alert/NotificationProvider";

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent){
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
        const result = await signUp.email({
            name,
            email,
            password
        })

        if (result.error){
            setError(result.error.message ?? "Failed to sign up")
        } else {
            const { title, options } = authNotifications.registerSuccess()
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
    <div >
        <form onSubmit={handleSubmit} className="min-w-300px w-full text-center border-2 border-gray-300 rounded-2xl px-10 bg-background">
            <h1 className="text-gray-900 text-2xl mt-10 font-semibold">Jadilah Bagian Dari Kami!</h1>
            <p className="text-gray-500 text-sm mt-2">Daftarkan dirimu sekarang</p>
            <div className="mt-4 flex-col space-y-1">
                <span className="flex self-start font-medium">Name</span>
                <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-xl pl-6 gap-2 pr-2">
                    <input 
                    type="name" 
                    name="name" 
                    placeholder="Masukkan nama" 
                    className="border-none outline-none ring-0 w-full" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />
                </div>
            </div>
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
            <div className="mt-4 text-left">
                <Checkbox name="basic-terms" isRequired>
                    <Checkbox.Content className="text-sm text-gray-700">
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                    <span>
                        Saya setuju dengan{" "}
                        <Link href="#" className="text-primary hover:underline text-sm">
                        syarat dan ketentuan
                        </Link>
                    </span>
                    </Checkbox.Content>
                </Checkbox>
            </div>
            { error && (
                <div className="p-2 mt-2 text-base rounded-xl text-red-800 bg-red-100">
                    {error}
                </div>
                )
            }
            <button disabled={loading} type="submit" className="mt-4 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity">
                {loading ? "Membuat.." : "Daftar"}
            </button>
            <p className="text-gray-500 text-sm mt-3 mb-11">
                Sudah punya akun?
                <Link href="/login" className="text-primary hover:underline font-medium"> Masuk</Link>
            </p>
        </form>
    </div>
  );
}