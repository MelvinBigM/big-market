
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import LatestProducts from "@/components/home/LatestProducts";
import LocationMap from "@/components/home/LocationMap";
import OpeningHours from "@/components/home/OpeningHours";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="flex flex-col w-full">
        {/* Bannière avec espacement réduit */}
        <div className="pt-[56px] sm:pt-[64px] w-full">
          <HeroBanner />
        </div>
        
        {/* Séparateur avec espacement réduit */}
        <div className="w-full flex justify-center my-1 sm:my-2">
          <Separator className="max-w-7xl w-[90%]" />
        </div>
        
        {/* Contenu principal avec espacements uniformes */}
        <div className="py-3 sm:py-4 md:py-6 w-full">
          <LatestProducts />
          <Separator className="my-4 sm:my-6 md:my-8 max-w-7xl mx-auto w-[90%]" />
          <LocationMap />
          <Separator className="my-4 sm:my-6 md:my-8 max-w-7xl mx-auto w-[90%]" />
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
