import {Inter} from 'next/font/google';
import './globals.css';
import TrpcProvider from '../components/TrpcProvider';

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'Next.js tRPC App',
    description: 'Example Next.js app with tRPC',
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <TrpcProvider>
            {children}
        </TrpcProvider>
        </body>
        </html>
    );
}
