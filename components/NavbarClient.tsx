"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, Button, Dropdown, Label } from "@heroui/react"
import { ArrowRightFromSquare, Person } from "@gravity-ui/icons"
import { signOut, useSession } from "@/lib/auth/auth-client"
import { toast } from "@heroui/react"
import { authNotifications } from "@/components/alert/NotificationProvider"

const navLinks = [
  { label: "TENTANG KAMI", href: "/about" },
  { label: "RELAWAN", href: "/volunteer" },
]

const NavbarClient = () => {
  const { data: session } = useSession()

  const user = session?.user
  const isAdmin = user?.role
  const hasAvatar = user?.image
  const isLoggedIn = !!user
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleDropdownAction = async (key: React.Key) => {
    switch (key) {
      case "profile":
        router.push("/profile");
        break;
      case "dashboard":
        router.push("/dashboard")
        break;
      case "logout": {
        await signOut();
        const { title, options } = authNotifications.logoutSuccess();
        toast.success(title, options);
        break;
      }
      case "signin":
        router.push("/login");
        break;
      default:
        break;
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 px-6 md:px-12 lg:px-24 xl:px-40 ${isScrolled || isMobileMenuOpen
          ? "bg-background/80 shadow-md backdrop-blur-sm"
          : "bg-background"
        }`}
    >
      <div className="py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/Logo/Joyful-logo.svg"
            alt="Joyful logo"
            width={96}
            height={36}
            priority
            style={{ height: "auto" }}
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-regular tracking-wide text-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="items-center flex gap-3">
            <Link
              href="/donation"
              className="px-6 py-2 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:brightness-105 transition-all duration-200 shadow-sm"
            >
              DONASI
            </Link>

            {/* User icon */}
            <Dropdown>
              <Button isIconOnly aria-label="Menu" variant="secondary">
                {!isLoggedIn ?
                  (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  ) : hasAvatar ?
                    (
                      <Avatar>
                        <Avatar.Image asChild height={40} src={hasAvatar} width={40}>
                          <Image alt="User Avatar" src={hasAvatar} />
                        </Avatar.Image>
                        <Avatar.Fallback>JD</Avatar.Fallback>
                      </Avatar>
                    )
                    :
                    (
                      <span className="font-bold ">{user?.name[0]}</span>
                    )
                }
              </Button>
              <Dropdown.Popover placement="bottom right">
                {isLoggedIn ?
                  (
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item id="profile" textValue="Profile">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Profile</Label>
                          <Person className="size-3.5 text-muted" />
                        </div>
                      </Dropdown.Item>
                      { isAdmin && 
                        <Dropdown.Item id="dashboard" textValue="Dashboard">
                          <div className="flex w-full items-center justify-between gap-2">
                            <Label>Dashboard</Label>
                          </div>
                        </Dropdown.Item>
                      }
                      <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Sign out</Label>
                          <ArrowRightFromSquare className="size-3.5 text-danger" />
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )
                  :
                  (
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item id="signin" textValue="Sign in">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label className="text-primary">Sign in</Label>
                          {/* <Person className="size-3.5 text-muted" /> */}
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-black/5 focus:outline-none transition-colors"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100 pb-5 border-t border-black/10" : "max-h-0 opacity-0 pb-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-4 pt-3">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-black/5">
            <Link
              href="/donation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide hover:brightness-105 transition-all duration-200 shadow-sm"
            >
              DONASI
            </Link>

              <Dropdown>
                <Button
                  className="flex w-full items-center justify-center gap-2 py-2 px-4 rounded-full border-2 border-gray-300 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                  variant="ghost"
                >
                  {isLoggedIn ? (
                    <span className="font-bold">{user?.name}</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )}
                  {/* <span>Akun</span> */}
                </Button>
                <Dropdown.Popover placement="bottom" className="w-full">
                  {isLoggedIn ? (
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item id="profile" textValue="Profile">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Profile</Label>
                          <Person className="size-3.5 text-muted" />
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item id="dashboard" textValue="Dashboard">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Dashboard</Label>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Sign out</Label>
                          <ArrowRightFromSquare className="size-3.5 text-danger" />
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu onAction={handleDropdownAction}>
                      <Dropdown.Item id="signin" textValue="Sign in">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label className="text-primary">Sign in</Label>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </Dropdown.Popover>
              </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarClient