import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Themeprovider } from '@/components/providers/theme-provider';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import Container from '@/components/global/Container';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SkillFlow',
  description: 'Take hold of your data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <Themeprovider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <Container>{children}</Container>
            <Toaster
              position='top-right'
              richColors
              closeButton
              expand={false}
            />
            <Footer />
          </Themeprovider>
        </QueryProvider>
      </body>
    </html>
  );
}
