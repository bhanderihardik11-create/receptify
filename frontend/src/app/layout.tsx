import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Receptify — AI Voice Receptionist, Answer Every Call',
  description:
    'Receptify helps Indian businesses run professional, compliance-aware AI calling campaigns — payment reminders, appointment reminders, lead follow-ups and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{ classNames: { toast: 'rounded-xl' } }}
        />
      </body>
    </html>
  );
}
