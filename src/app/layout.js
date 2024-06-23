import Link from 'next/link';
import "./globals.scss";
import "./layout.scss";

export const metadata = {
  title: "KraiSoft Web Game Sample",
  description: "KraiSoft Web Game Sample Task",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <Link className="logo" href="/">Demo Game</Link>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/play">Play</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </header>
          {/* <main className="main">{children}</main> */}
          <section className="main">{children}</section>
          <footer className="footer">
            <p>&copy; 2024 KraiSoft Web Game Sample App. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
