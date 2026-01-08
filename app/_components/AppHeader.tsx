import { SidebarTrigger } from '@/components/ui/sidebar'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import React from 'react'
import Image from 'next/image'

function AppHeader() {
  const { user } = useUser()

  return (
    <div className="w-full p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Image
            src="/logo2.png"
            alt="logo"
            width={150}
            height={150}
            className="h-10 w-10"
          />
          <h2 className="font-bold text-lg">Insightica</h2>
        </div>

        {/* Navbar / Auth */}
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse block w-full overflow-hidden transition-all duration-300 sm:w-auto"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7">
            {!user ? (
              <SignInButton
                mode="modal"
                signUpForceRedirectUrl="/dashboard"
              >
                <div className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 py-2 sm:py-0 cursor-pointer">
                  <svg
                    className="flex-shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Get Started
                </div>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppHeader
    