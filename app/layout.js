import "./globals.css";

export const metadata = {
  title: "Medication Manager",
  description: "Next.js full-stack version of the medication manager"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
