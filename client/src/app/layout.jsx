import localFont from "next/font/local";
import { Urbanist, IBM_Plex_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import ReactQueryProvider from "@/util/provider/ReactQueryProvider";


const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const helvetica = localFont({
  src: [
    {

      path: "../../public/fonts/HelveticaNeueMedium.ttf",
      weight: "500",
    }
  ],
  variable: "--font-helvetica",
})

export const metadata = {
  title: "Rida",
  description: "Rida Ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${urbanist.variable} ${ibmPlexMono.variable} ${poppins.variable} ${helvetica.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Navbar />
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
