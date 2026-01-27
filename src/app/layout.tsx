import './globals.css';

// Root layout is minimal - locale-specific layout handles everything
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
