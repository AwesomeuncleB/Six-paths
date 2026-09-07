import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Six Paths Smart-House | Find your next home",
 description: "Explore Kaduna homes, estimate a rent-to-own plan, and manage properties, repairs, and payments in the Six Paths workspace.",
 icons: { icon: "/brand.png", apple: "/brand.png" },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body>{children}</body></html>;
}
