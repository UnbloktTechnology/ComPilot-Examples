import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1A1B1E] text-white">
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
