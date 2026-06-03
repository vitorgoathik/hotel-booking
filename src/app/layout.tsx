import type { ReactNode } from "react";

// Thin root layout — required by Next.js for the app directory.
// The full layout (html, body, header, footer) lives in [locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
