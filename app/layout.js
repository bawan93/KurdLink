import './globals.css'
import NavBar from '../components/NavBar'
import BottomNav from '../components/BottomNav'
import SessionTracker from '../components/SessionTracker'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: 'Komek',
  description: 'Your helping hand in the UK'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, overflowX: 'hidden', paddingBottom: 80 }}>
        <SessionTracker />
        <NavBar />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}