import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import { ToggleProvider } from "@/context/control";
import ToastContainer from "@/components/ToastContainer";
import { ToastProvider } from "@/context/ToastContext";
import Loading from "./loading";
import { Suspense } from "react";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import Provider from "@/components/Provider/Provider";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const APP_NAME = "Pirate Social";
const APP_DEFAULT_TITLE = "My Awesome Pirate Social App";
const APP_TITLE_TEMPLATE = "%s - Pirate Social App";
const APP_DESCRIPTION = "Best Pirate Social app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ToggleProvider>
          <ToastProvider>
                <Provider>
                  {children}
                </Provider>
              <Suspense fallback={<Loading />} />
            <ToastContainer />
          </ToastProvider>
        </ToggleProvider>
      </body>
    </html>
  );
}

