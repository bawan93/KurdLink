import './globals.css'
import NavBar from '../components/NavBar'
import BottomNav from '../components/BottomNav'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: 'KurdLink',
  description: 'Your trusted Kurdish community platform'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden', paddingBottom: 80 }}>
        <NavBar />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}