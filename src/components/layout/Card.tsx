import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const getPaddingClass = (padding: string) => {
  switch (padding) {
    case 'sm':
      return 'p-4';
    case 'md':
      return 'p-6';
    case 'lg':
      return 'p-8';
    default:
      return 'p-6';
  }
};

export function Card({
  children,
  title,
  icon,
  className = '',
  padding = 'md',
}: CardProps) {
  const paddingClass = getPaddingClass(padding);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg ${paddingClass} ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
