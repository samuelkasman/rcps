interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function UserAvatar({ name, email, size = "md" }: UserAvatarProps) {
  const initial = name?.[0] || email?.[0] || "U";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-charcoal flex items-center justify-center text-ivory font-medium uppercase`}
    >
      {initial}
    </div>
  );
}

