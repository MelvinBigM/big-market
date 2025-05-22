
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import LatestProducts from "@/components/home/LatestProducts";
import LocationMap from "@/components/home/LocationMap";
import OpeningHours from "@/components/home/OpeningHours";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className="flex-1">
        <div className="py-6">
          <HeroBanner />
        </div>
        
        <Separator className="border-t" />
        
        <div className="py-8">
          <LatestProducts />
        </div>
        
        <Separator className="border-t" />
        
        <div className="py-8">
          <LocationMap />
        </div>
        
        <Separator className="border-t" />
        
        <div className="py-8">
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
