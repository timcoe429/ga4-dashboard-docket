import './globals.css'

export const metadata = {
  title: 'GA4 Dashboard',
  description: 'Analytics Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
