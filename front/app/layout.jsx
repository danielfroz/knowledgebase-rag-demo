import { Header } from '@/components';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "MongoDB Gen AI Demos",
  description: "Gen AI applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className='container mx-auto flex flex-col gap-2'>
            <Header/>
            {children}
          </main>
          <Toaster/>
        </Providers>
      </body>
    </html>
  );
}
