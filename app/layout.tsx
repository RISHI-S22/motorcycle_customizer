import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { MotorcycleProvider } from "@/lib/motorcycle-context"

export const metadata: Metadata = {
  title: "Hologram Motorcycle Customizer",
  description: "3D Motorcycle Customization with Hologram Effects",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-black text-white`}>
        <MotorcycleProvider>{children}</MotorcycleProvider>
      </body>
    </html>
  )
}
