import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="font-heading text-2xl tracking-wide text-ivory hover:text-emerald transition-colors duration-200"
    >
      RCPS
    </Link>
  );
}

