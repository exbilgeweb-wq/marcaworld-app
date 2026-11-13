/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Bu paketler Node'da dosya sisteminden veri (font, AFM, worker) okur;
    // paketlenmeden doğrudan node_modules'tan yüklenmeleri gerekir.
    serverComponentsExternalPackages: ['pdfkit', 'pdfjs-dist', 'nodemailer', 'dejavu-fonts-ttf', 'qrcode'],
    // Vercel'de PDF raporlarının Türkçe fontu fonksiyon paketine dahil edilsin.
    outputFileTracingIncludes: {
      '/api/**/*': [
        './node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf',
        './node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf',
        './node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
        './node_modules/pdfjs-dist/standard_fonts/**',
      ],
    },
  },
};

module.exports = nextConfig;
