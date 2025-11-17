// Global layout for hele sitet
import "./globals.css";
import HeaderAuth from "@/src/components/HeaderAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        <header className="border-b p-4 flex justify-between items-center">
          <span>Session Planner</span>
          <HeaderAuth />
        </header>
        <main className="flex-1 p-4">{children}</main>
        <footer className="border-t p-4 text-sm text-gray-600">© {new Date().getFullYear()}</footer>
      </body>
    </html>
  );
}
