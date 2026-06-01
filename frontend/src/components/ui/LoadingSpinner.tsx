interface LoadingSpinnerProps {
  size?: "sm" | "md";
  color?: string;
  message?: string;
  centered?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  message,
  centered = false,
  className,
}: LoadingSpinnerProps) {
  const spinnerClass = [
    "spinner-border",
    size === "sm" ? "spinner-border-sm" : "",
    `text-${color}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <div className={spinnerClass} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (!centered) {
    return spinner;
  }

  return (
    <div className="text-center py-5">
      {spinner}
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );
}
