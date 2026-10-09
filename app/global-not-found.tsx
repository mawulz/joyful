import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
    variable: "--font-google-sans-flex",
    subsets: ["latin"],
    adjustFontFallback: false,
    fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
    title: "404 - Halaman Tidak Ditemukan | Joyful",
    description: "Halaman yang Anda tuju tidak dapat ditemukan atau telah dipindahkan.",
};

export default function GlobalNotFound() {
    return (
        <html
            lang="id"
            className={`${googleSansFlex.variable} min-h-screen h-full antialiased`}
        >
            <body className="min-h-screen flex flex-col justify-between bg-background text-foreground relative overflow-x-hidden selection:bg-secondary/30">

                <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex justify-center sm:justify-start">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 transition-transform hover:scale-105"
                        aria-label="Kembali ke Beranda Joyful"
                    >
                        <Image
                            src="/Logo/Joyful-logo.svg"
                            alt="Joyful Logo"
                            width={130}
                            height={38}
                            priority
                            style={{ height: "auto" }}
                        />
                    </a>
                </header>

                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                    <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center">
                        <div className="relative mb-2 select-none">
                            <span className="text-8xl sm:text-9xl font-black tracking-tighter text-primary/15 block">
                                404
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl font-black tracking-tight text-primary">
                                404
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                            Halaman Tidak Ditemukan
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md mb-8">
                            Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau
                            tautan yang dimasukkan belum tepat.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a
                                href="/"
                                className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm sm:text-base shadow-md shadow-primary/25 hover:bg-primary/90 transition-all duration-200 text-center"
                            >
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-6 text-center text-xs sm:text-sm text-gray-500">
                    <p>© 2026 Joyful. Wujudkan kebahagiaan anak-anak Indonesia.</p>
                </footer>
            </body>
        </html>
    );
}
