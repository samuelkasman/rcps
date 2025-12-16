"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="space-y-8 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div>
        <h1 className="text-2xl font-medium text-ivory mb-2">
          Authentication Error
        </h1>
        <p className="text-silver">
          {getErrorMessage(error)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link href="/auth/signin">
          <Button className="w-full" size="lg">
            Try again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full" size="lg">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function getErrorMessage(error: string | null): string {
  switch (error) {
    case "Configuration":
      return "There is a problem with the server configuration.";
    case "AccessDenied":
      return "Access denied. You do not have permission to sign in.";
    case "Verification":
      return "The verification link may have expired or already been used.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
      return "There was a problem with the authentication provider.";
    case "OAuthAccountNotLinked":
      return "This email is already linked to another account. Please sign in with your original provider.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An unexpected error occurred during authentication.";
  }
}

