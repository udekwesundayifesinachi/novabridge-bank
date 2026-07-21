import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NovabridgeBank – Bank Smarter. Borrow Faster. Grow Stronger.',
  description: 'NovabridgeBank is a premium digital bank offering instant loans, savings, virtual cards, transfers, and business banking. Join 250,000+ customers today.',
  keywords: 'digital bank, online banking, instant loans, savings account, virtual card, NovabridgeBank',
  openGraph: {
    title: 'NovabridgeBank – Premium Digital Banking',
    description: 'Bank Smarter. Borrow Faster. Grow Stronger.',
    images: [{ url: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
