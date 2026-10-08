import DonationForm from '@/components/Donation-Form'
import React from 'react'

const page = () => {
  return (
    <section className="relative mb-8 mt-0 w-full overflow-hidden rounded-2xl bg-linear-to-l from-green from-40% to-[#E8F9AD] to-95% md:mt-18">
        <div
            className="absolute inset-0 bg-cover bg-left opacity-20"
            style={{
            backgroundImage:
                "url('/asset/pramod-tiwari-kCn35AvXjaI-unsplash.jpg')",
            }}
            aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-150 flex-col items-center gap-10 px-4 py-8 sm:px-6 md:py-12 lg:flex-row lg:gap-6 lg:px-10">
            <div className="flex w-full flex-col justify-center pt-4 lg:pt-0 sm:pl-10 lg:w-1/2 lg:pl-6">
                <h1 className="mb-4 lg:mb-10 ">
                    Dukung Pergerakan Kami
                </h1>

                <p className="max-w-lg">
                    Setiap rupiah yang Anda berikan akan disalurkan secara transparan
                    untuk operasional program edukasi dan bantuan anak.
                </p>
            </div>

            <div className="flex w-full justify-center lg:w-1/2 lg:justify-end lg:pr-4">
            <DonationForm />
            </div>
        </div>
    </section>
  )
}

export default page