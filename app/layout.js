import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Marcaworld — Yurtdışında şirket kuruluşu ve marka tescili',
  description: 'Yurtdışında şirket kurun: 9 ülke, tek temel paket ve ihtiyacınıza göre eklediğiniz hizmetler. Marka tescili, WIPO başvurusu ve Teknokent/Ar-Ge kuruluşu.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
