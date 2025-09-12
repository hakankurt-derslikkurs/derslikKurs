import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BackToTop from './components/BackToTop'
import CookieBanner from './components/CookieBanner'
import { SupabaseProvider } from './components/SupabaseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Derslik Kurs',
  description: 'Geleceğinizi şekillendiren eğitim deneyimi. Kaliteli öğretmenler ve modern eğitim yöntemleri.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <SupabaseProvider>
          <Navigation />
          {children}
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <CookieBanner />
        </SupabaseProvider>
      </body>
    </html>
  )
}
