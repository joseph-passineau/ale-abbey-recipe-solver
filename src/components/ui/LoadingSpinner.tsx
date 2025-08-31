interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getSizeClass = (size: string) => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'md':
      return 'w-8 h-8';
    case 'lg':
      return 'w-16 h-16';
    default:
      return 'w-8 h-8';
  }
};

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClass = getSizeClass(size);

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-amber-600 ${sizeClass} ${className}`}
    />
  );
}
