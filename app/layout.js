import './globals.css'
import AuthSessionProvider from '../components/SessionProvider'

export const metadata = {
  title: 'GA4 Dashboard',
  description: 'Analytics Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
