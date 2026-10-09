"use client"

import VolunteerBtn from "@/components/Volunteer-Btn"
import VolunteerForm from "@/components/Volunteer-Form"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "@/lib/auth/auth-client"
import { useEffect, useRef, useState } from "react"

const Page = () => {
  const { data: session, isPending } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = !!session?.user

  const showPending = !mounted || isPending
  const showLoginOverlay = mounted && !isPending && !isLoggedIn

  const ref = useRef<HTMLElement | null>(null)

  const handleClick = () => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="mb-20">
      {/* hero */}
      <section className='mt-20 flex flex-col lg:flex-row justify-between items-center mx-7 md:mx-10'>
        <div className="max-w-4xl">
          <h1 className="mb-6">Mari Berbagi Waktu dan Senyuman</h1>
          <p>Pengalaman terbaik dalam hidup adalah saat kita bisa berguna bagi orang lain.</p>
          <VolunteerBtn onClick={handleClick} />
        </div>
        <Image
        src="/asset/photogramy-studio-g5BY0O_Crdw-unsplash.jpg"
        alt=""
        width={500}
        height={500}
        style={{ height: "auto" }}
        className="h-64 w-full rounded-xl md:h-auto md:w-100 mt-10 md:mt-0"
        />
      </section>
      
      {/* requirements */}
      <section className="mt-20 bg-primary rounded-2xl">
        <div className="flex flex-col gap-4 py-15 px-12">
            <h2 className="text-white font-medium mb-2">Persyaratan Menjadi Relawan</h2>
            <ul className="text-white space-y-3">
              <li className="flex items-center gap-3">
                <Image src="/asset/shapes/star.png" alt="" width={10} height={10} className="h-4 w-auto"/> 
                <p>Berusia minimal 18 tahun</p>
              </li>
              <li className="flex items-center gap-3">
                <Image src="/asset/shapes/square.png" alt="" width={10} height={10} className="h-4 w-auto"/>
                <p>Komitmen, ramah, dan menyukai dunia anak-anak</p>
              </li>
              <li className="flex items-center gap-3">
                <Image src="/asset/shapes/circle.png" alt="" width={10} height={10} className="h-4 w-auto"/>
                <p>Bersedia mengikuti pengarahan (briefing) sebelum kegiatan berlangsung</p>
              </li>
            </ul>
        </div>
      </section>

      <section ref={ref} className="scroll-mt-10 mt-8 md:mt-18 rounded-2xl min-h-200 bg-linear-to-b from-secondary from-40% to-[#E4FFFF] to-95%">
        <div className="flex flex-col lg:flex-row justify-center items-center py-8 md:py-12 px-4 sm:px-6 lg:px-10 gap-10 lg:gap-6">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div
                aria-hidden={showLoginOverlay || undefined}
                inert={showLoginOverlay}
                className={
                  showLoginOverlay
                    ? "pointer-events-none select-none blur-sm opacity-60"
                    : showPending
                    ? "opacity-60"
                    : ""
                }
              >
                <VolunteerForm />
              </div>

              {showLoginOverlay && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/40 backdrop-blur-[1px] px-4 text-center">
                  <p className="text-gray-800 font-medium">
                    Masuk untuk mendaftar sebagai relawan
                  </p>
                  <Link
                    href="/login"
                    className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:brightness-105 transition-all shadow-sm"
                  >
                    Masuk
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2 px-4 mt-4 flex justify-self-center border-primary border border-dashed w-fit max-w-full rounded-full text-primary">
              <span className="text-xs sm:text-sm">
                Hanya kandidat yang terpilih yang akan dihubungi
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center w-full lg:w-1/2 px-2 sm:px-10 lg:px-20">
            <h2 className="mb-6 lg:mb-10 ">
              Apa Kata Mereka?
            </h2>

            <div className="w-[70%] sm:w-[50%] lg:w-[40%] max-w-70 bg-white p-3 pb-6 rounded-sm shadow-md -rotate-2">
              <Image
                src="/asset/samces.jpeg"
                alt="Samuel Caesar"
                height={500}
                width={500}
                className="w-full aspect-square object-cover"
              />
              <p className="mt-5 text-center text-base sm:text-lg font-medium text-primary">
                Samuel Caesar
              </p>
            </div>

            <p className="text-primary text-center mt-8 lg:mt-10 max-w-lg">
              &#34;Bergabung dengan yayasan ini membuka mata saya bahwa hal kecil yang kita
              lakukan bisa berdampak luar biasa besar bagi senyuman anak-anak.&#34;
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page