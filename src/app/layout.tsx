import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'DigitalSpeed - Web Development & Digital Agency',
    template: '%s | DigitalSpeed',
  },
  description:
    'A modern digital agency specializing in web development, design, and digital marketing.',
  keywords: [
    'web development',
    'digital agency',
    'web design',
    'digital marketing',
    'PERN stack',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
  ],
  authors: [{ name: 'DigitalSpeed Team' }],
  creator: 'DigitalSpeed',
  publisher: 'DigitalSpeed',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://digitalspeed.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DigitalSpeed - Web Development & Digital Agency',
    description:
      'A modern digital agency specializing in web development, design, and digital marketing.',
    url: 'https://digitalspeed.com',
    siteName: 'DigitalSpeed',
    images: [
      {
        url: 'https://digitalspeed.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DigitalSpeed - Web Development & Digital Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigitalSpeed - Web Development & Digital Agency',
    description:
      'A modern digital agency specializing in web development, design, and digital marketing.',
    images: ['https://digitalspeed.com/og-image.jpg'],
    creator: '@digitalspeed',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DigitalSpeed',
              url: 'https://digitalspeed.com',
              logo: 'https://digitalspeed.com/logo.png',
              sameAs: [
                'https://facebook.com/digitalspeed',
                'https://twitter.com/digitalspeed',
                'https://instagram.com/digitalspeed',
                'https://linkedin.com/company/digitalspeed',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-123-456-7890',
                contactType: 'customer service',
                email: 'info@digitalspeed.com',
                areaServed: 'Worldwide',
                availableLanguage: ['English'],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased theme-transition`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
