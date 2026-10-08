import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-10 mt-auto">
      <div className="layout-container flex flex-col gap-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <Image src="/Logo/Joyful-logo-white.svg" alt="Joyful Logo" width={160} height={48} className="mb-4" style={{ height: 'auto'}} />
          
          <p className="text-sm md:text-base leading-relaxed">
            Wadah nirlaba yang berfokus pada kesejahteraan, pendidikan, dan penyaluran kebahagiaan bagi anak-anak Indonesia.
          </p>

          <div className="text-sm md:text-base leading-relaxed mt-2">
            <p className="opacity-90">Alamat:</p>
            <p>Jl. Kebon Jeruk Raya No. 27, Jakarta Barat, DKI Jakarta 11530</p>
          </div>

          <div className="text-sm md:text-base leading-relaxed mt-2">
            <p className="opacity-90">Email:</p>
            <Link href="mailto:kontak@joyful.or.id" className="hover:underline">
              kontak@joyful.or.id
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-end mt-4 gap-6">
          <p className="text-xs md:text-sm">
            © 2026 Mawulz. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="#" aria-label="Facebook" className="hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </Link>
            <Link href="#" aria-label="YouTube" className="hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </Link>
            <Link href="#" aria-label="Instagram" className="hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
