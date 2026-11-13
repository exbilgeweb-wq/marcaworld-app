import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Genel site sayfaları (üst menü + alt bilgi). Yönetim paneli, izleme
// platformu ve müşteri portalı bu grubun dışında, kendi düzenleriyle çalışır.
export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
