import "./globals.css";

export const metadata = {
  title: "Life RPG",
  description: "Stop organising your life. Play it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
