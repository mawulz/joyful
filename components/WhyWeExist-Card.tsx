"use client"
import Image from "next/image";

const WhyWeExist = () => {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-secondary md:max-w-screen">
      <div className="md:flex">
        <div className="relative md:shrink-0">
          <div className="absolute inset-0 bg-linear-to-b md:bg-linear-to-r from-secondary/10 via-secondary/10 to-secondary z-10 pointer-events-none"></div>
          <Image
            src="/asset/photogramy-studio-g5BY0O_Crdw-unsplash.jpg"
            alt=""
            loading="eager"
            width={500}
            height={500}
            className="h-64 w-full object-cover md:h-auto md:w-80"
          />
        </div>
        <div className="p-8 flex flex-col justify-center gap-3">
          <h2 className="text-3xl font-bold">Mengapa Kami Hadir?</h2>
          <p className="leading-relaxed">Kami percaya bahwa setiap anak memiliki hak untuk bermimpi dan meraih masa depan yang bahagia. Melalui program kolaborasi, bantuan langsung, dan dukungan komunitas, kami hadir untuk menjadi jembatan kebaikan bagi anak-anak yang membutuhkan.</p>
        </div>
      </div>
    </div>
  )
}

export default WhyWeExist;