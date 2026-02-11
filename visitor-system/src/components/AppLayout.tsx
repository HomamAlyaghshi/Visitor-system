import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      {title && (
        <header className="w-full bg-white border-b border-gray-200">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 text-right">{title}</h1>
          </div>
        </header>
      )}
      
      {/* Main Content Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
