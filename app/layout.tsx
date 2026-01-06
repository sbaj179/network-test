import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Communication Network',
  description: 'My Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}


