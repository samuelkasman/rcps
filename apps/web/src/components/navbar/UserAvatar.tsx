const SIZE_CLASSES = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ name, email, size = "md" }: UserAvatarProps) {
  const initial = name?.[0] || email?.[0] || "U";

  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full bg-charcoal flex items-center justify-center text-ivory font-medium uppercase`}
    >
      {initial}
    </div>
  );
}
