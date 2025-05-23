
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import LatestProducts from "@/components/home/LatestProducts";
import LocationMap from "@/components/home/LocationMap";
import OpeningHours from "@/components/home/OpeningHours";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className={`flex-1 ${isMobile ? 'px-0' : ''}`}>
        <HeroBanner />
        {/* Separator removed from here */}
        <div className={isMobile ? 'px-4' : ''}>
          <LatestProducts />
          <Separator className="max-w-7xl mx-auto border-t" />
          <LocationMap />
          <Separator className="max-w-7xl mx-auto border-t" />
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
