// app/layout.tsx
import './globals.css';
import { Fleur_De_Leah } from 'next/font/google';

const fleur = Fleur_De_Leah({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const metadata = {
  title: 'Yeva',
  description: 'For my baby',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fleur.className}>{children}</body>
    </html>
  );
}
