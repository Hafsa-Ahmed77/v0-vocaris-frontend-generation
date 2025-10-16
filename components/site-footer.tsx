import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              V
            </span>
            <span className="font-semibold">Vocaris</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your intelligent meeting partner for seamless conversation and smart collaboration.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <Link href="/about" className="hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/contact" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/privacy" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline underline-offset-4">
              Terms
            </Link>
          </div>
        </nav>
        <p className="text-sm text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Vocaris Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
