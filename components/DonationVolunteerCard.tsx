"use client"

import { Card, Button } from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const DonationVolunteerCard = () => {
  const router = useRouter()

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-15 mt-10 w-full">
      <Card className="min-h-80 overflow-hidden rounded-3xl w-full bg-pink/80 px-8 pt-12">
          <Image
          alt="Volunteer Application"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          src="/asset/pramod-tiwari-kCn35AvXjaI-unsplash.jpg"
          width={500}
          height={500}
          />
          <Card.Header className="z-10 text-white gap-2">
            <Card.Title className="text-3xl font-bold tracking-wide text-black">
              Gabung Jadi Relawan
            </Card.Title>
            <Card.Description className="text-sm leading-5 font-medium text-black">
              Support school needs and access to education for children in underserved communities.
            </Card.Description>
          </Card.Header>
          <Card.Footer className="z-10 mt-auto flex items-center">
            <Button 
            onPress={() => router.push("/volunteer")}
            className="bg-primary hover:bg-primary hover:brightness-110 transition-all duration-200" 
            fullWidth
            >
              DAFTARKAN DIRI
            </Button>
          </Card.Footer>
      </Card>
      
      <Card className="min-h-80 overflow-hidden rounded-3xl w-full bg-green/80 px-8 pt-12">
          <Image
          alt="Donation"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          src="/asset/lucy-davis-kM_-eFVRwao-unsplash.jpg"
          width={500}
          height={500}
          />
          <Card.Header className="z-10 text-white gap-2">
            <Card.Title className="text-3xl font-bold tracking-wide text-black">
              Berdonasi
            </Card.Title>
            <Card.Description className="text-md leading-5 font-medium text-black">
              Help provide free, healthy meals for children.
            </Card.Description>
          </Card.Header>
          <Card.Footer className="z-10 mt-auto flex items-center">
            <Button 
            onPress={() => router.push("/donation")}
            className="bg-primary hover:bg-primary hover:brightness-110 transition-all duration-200" 
            fullWidth
            >
              DONASI SEKARANG
            </Button>
          </Card.Footer>
      </Card>
    </div>
  )
}

export default DonationVolunteerCard