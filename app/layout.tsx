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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&display=swap"
          rel="stylesheet"
        />

      </head>
      <body className={fleur.className}>{children}</body>
    </html>
  );
}
