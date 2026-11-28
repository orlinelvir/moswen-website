import "./global.css";
import Script from "next/script";
import BootstrapForBrowser from "@/components/ui/bootstrapForBrowser";
import Attribution from "@/components/ui/attribution";
import Header from "@/components/sections/header";
import CallToAction from "@/components/sections/callToAction";
import Footer from "@/components/sections/footer";
import { site } from "@/utlits/fackData/siteData";

const description =
  "Branding, landing pages, sitios web premium, anuncios en Meta y agentes de IA para negocios latinos en EE.UU. y Honduras. Aplica a una consulta.";

export const metadata = {
  metadataBase: new URL(site.url),
  title: "Moswen Designs | Marca, web y anuncios para negocios latinos",
  description,
  icons: { icon: "/images/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Moswen Designs",
    locale: "es_419",
    title: "Moswen Designs | Marca, web y anuncios para negocios latinos",
    description,
  },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','2281900699017607');fbq('track','PageView');
        `}</Script>
        <BootstrapForBrowser />
        <Attribution />
        <Header />
        {children}
        <CallToAction />
        <Footer />
      </body>
    </html>
  );
}
