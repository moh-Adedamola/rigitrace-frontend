import type { ReactNode } from "react";
import Link from "next/link";

// Speed-first, minimal chrome — nothing that slows down a verification.
export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
            RigiTrace
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
