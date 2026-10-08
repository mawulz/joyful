import Image from "next/image"

const page = () => {
  return (
    <div className="mb-20">
        <section 
          className="w-full flex justify-center items-center h-64 sm:h-100 md:h-140 lg:h-185 bg-cover bg-top bg-no-repeat overflow-hidden"
          style={{ backgroundImage: "url('/background/hero-about.png')" }}
        >
          <Image
            src="/Logo/Joyful-logo-white.svg"
            alt="Joyful Logo"
            width={200}
            height={200}
            priority
            className="w-36 sm:w-44 md:w-52 h-auto object-contain"
          />
        </section>
        <section className="grid mx-10 justify-items-center">
            <div className="flex flex-col items-center min-h-60 mt-10">
                <span className="mb-5 text-gray-400 font-medium">Latar Belakang Kami</span>
                <p className="text-center text-xl mb-10">Kami percaya bahwa setiap anak memiliki hak untuk bermimpi dan meraih masa depan yang bahagia. Melalui program kolaborasi, bantuan langsung, dan dukungan komunitas, kami hadir untuk menjadi jembatan kebaikan bagi anak-anak yang membutuhkan.</p>
                <Image src="/asset/shapes/circle.png" alt="" height={50} width={50}/>
            </div>
            <div className="flex justify-between items-center gap-8 min-h-80 max-w-6xl mx-auto w-full px-2">
                <div className="flex flex-col gap-4 max-w-2xl">
                    <span className="text-gray-400 font-medium">Visi Kami</span>
                    <p className="">Menjadi wadah nirlaba terdepan di Indonesia yang mewujudkan kualitas hidup, pendidikan, dan kebahagiaan yang layak bagi setiap anak.</p>
                </div>
                <Image src="/asset/shapes/square.png" alt="" width={60} height={60} className="shrink-0" style={{ height: "auto" }} />
            </div>
            <div className="flex justify-between items-center gap-8 min-h-80 max-w-6xl mx-auto w-full px-2">
                <Image src="/asset/shapes/star.png" alt="" width={60} height={60} className="shrink-0" style={{ height: "auto" }} />
                <div className="flex flex-col gap-4 max-w-2xl text-right">
                    <span className="text-gray-400 font-medium">Misi Kami</span>
                    <p className="text-lg">Mewujudkan kehidupan yang lebih baik bagi anak-anak kurang mampu melalui bantuan sosial, pendidikan, dan kesehatan, dengan membangun jaringan relawan muda serta kemitraan untuk menciptakan dampak sosial yang berkelanjutan.</p>
                </div>
            </div>
            <Image
            src="/asset/shapes/strip.png"
            alt=""
            width={80}
            height={80}
            style={{ height: "auto" }}
            />
        </section>
    </div>
  )
}

export default page