import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MedCare Multi-Speciality Hospital | New Delhi',
  description: 'MedCare Multi-Speciality Hospital in New Delhi offers world-class healthcare with 200+ expert doctors across 30+ specialities. Book appointments online, 24/7 emergency services.',
  keywords: 'hospital, healthcare, doctors, appointment, medical, New Delhi, multi-speciality, cardiology, neurology, orthopedics',
  openGraph: {
    title: 'MedCare Multi-Speciality Hospital | New Delhi',
    description: 'World-class healthcare with compassion and excellence. 200+ expert doctors, 30+ specialities.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
