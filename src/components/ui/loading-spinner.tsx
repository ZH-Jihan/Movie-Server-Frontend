/**
 * LoadingSpinner: A beautiful, reusable loading spinner for use during data loading.
 * @param size - The size of the spinner in pixels (default: 32)
 */
export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-8">
      <svg
        className="animate-spin text-primary"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
        />
        {/* Animated arc */}
        <path
          className="opacity-70"
          d="M45 25c0-11.046-8.954-20-20-20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
