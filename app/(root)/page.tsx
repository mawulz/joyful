"use client"

import ExploreBtn from "@/components/Contribution-Btn"
import DonationVolunteerCard from "@/components/DonationVolunteerCard"
import WhyWeExistCard from "@/components/WhyWeExist-Card"
import { useRef } from "react"

const page = () => {
  const ref = useRef<HTMLElement | null>(null)

  const handleClick = () => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  
  return (
    <div className="mb-20">
      <section className="mt-30 flex flex-col">
          <h1 className="text-center">Setiap Harapan Layak Diperjuangkan</h1>
          <p className="text-center mt-6">
            Bersama kami, mari wujudkan sejuta kebahagiaan dan masa depan yang <br /> lebih cerah bagi anak-anak Indonesia.
          </p>
          <ExploreBtn onClick={handleClick}/>
      </section>

      <section className="mt-30">
        <WhyWeExistCard />
      </section>

      <section ref={ref} className="scroll-mt-25 mt-20 flex flex-col items-center">
        <h2>Jadilah Bagian Dari Kami</h2>
        <DonationVolunteerCard/>
      </section>
    </div>
  )
}

export default page