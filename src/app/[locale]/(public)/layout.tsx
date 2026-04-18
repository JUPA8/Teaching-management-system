import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StagingBanner from '@/components/StagingBanner';
import ConditionalFloatingActions from '@/components/ConditionalFloatingActions';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StagingBanner />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <ConditionalFloatingActions />
    </>
  );
}
