export const metadata = {
  title: 'GA4 Dashboard',
  description: 'Analytics Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
