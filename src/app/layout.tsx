
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from '../app/components/Navbar'
import Footer from '../app/components/Footer'
import { Toaster } from 'react-hot-toast'
import { Outfit } from 'next/font/google'


const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})
export const metadata = {
  title: 'EduCloud - Plataforma de Cursos Virtuales',
  description: 'Aprende con los mejores cursos online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={outfit.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}