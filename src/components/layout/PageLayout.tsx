import { type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  background?: 'amber' | 'green' | 'red';
}

const getBackgroundClass = (background: string) => {
  switch (background) {
    case 'amber':
      return 'bg-gradient-to-br from-amber-50 to-orange-100';
    case 'green':
      return 'bg-gradient-to-br from-green-50 to-amber-100';
    case 'red':
      return 'bg-gradient-to-br from-red-50 to-orange-100';
    default:
      return 'bg-gradient-to-br from-amber-50 to-orange-100';
  }
};

export function PageLayout({
  children,
  title,
  subtitle,
  background = 'amber',
}: PageLayoutProps) {
  const backgroundClass = getBackgroundClass(background);

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <div className="container mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
                {title}
              </h1>
            )}
            {subtitle && <p className="text-lg text-amber-700">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
