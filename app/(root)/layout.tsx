import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-16 pt-18 md:pt-0">
        {children}
      </main>
    </>
  );
}
