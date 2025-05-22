
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
        {/* Bannière avec padding-top ajusté pour éviter le débordement sur la navbar */}
        <div className="w-full pt-16">
          <HeroBanner />
        </div>
        
        {/* Séparateur avec espacement uniforme */}
        <div className="w-full flex justify-center my-2 sm:my-3 md:my-4">
          <Separator className="max-w-7xl w-[90%]" />
        </div>
        
        {/* Contenu principal avec espacements uniformes */}
        <div className="py-4 sm:py-6 md:py-8 w-full">
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
