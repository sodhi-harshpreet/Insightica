import { PricingTable, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import ToggleTheme from "./ToggleTheme";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function AppHeader() {
  const { user } = useUser();

  return (
    <header
  className="
    sticky top-0 z-40 w-full
    border-b border-neutral-200 dark:border-neutral-800
    bg-white dark:bg-neutral-950
    mb-4
  "
>
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

    {/* Logo */}
    <Link href="/dashboard">
    <div className="flex items-center gap-3">
      <Image
        src="/logo2.png"
        alt="Insightica logo"
        width={36}
        height={36}
        className="rounded"
      />
      <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Insightica
      </span>
    </div>
    </Link>

    {/* Right */}
    <div className="flex items-center gap-4">
      {!user ? (
        <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
          <button
            className="
              inline-flex items-center gap-2
              rounded-md px-4 py-2 text-sm font-medium
              text-neutral-700 dark:text-neutral-300
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition
            "
          >
            Get Started
          </button>
        </SignInButton>
      ) : (
        <div className="flex items-center gap-2 ">
          <ToggleTheme />

          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-9 w-9 ring-1 ring-neutral-300 dark:ring-neutral-700",
              },
            }}
          />
          <Link href="/dashboard/pricing">
  <Button
    variant="outline"
    className="
      rounded-full
      border-amber-300/60 dark:border-amber-500/30
      text-amber-700 dark:text-amber-400
      bg-amber-50/40 dark:bg-amber-500/10
      hover:bg-amber-100/60 dark:hover:bg-amber-500/20
      hover:text-amber-800 dark:hover:text-amber-300
      transition-all duration-200
    "
  >
    Subscription
  </Button>
</Link>


        </div>
      )}
    </div>
  </div>
</header>

  );
}

export default AppHeader;
