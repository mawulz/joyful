"use client"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex-col flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background/auth-bg.jpg')" }}
    >
      {children}
    </main>
  );
}
