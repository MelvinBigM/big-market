
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
        {/* Bannière avec espacement adaptatif minimal */}
        <div className="pt-[50px] xs:pt-[52px] sm:pt-[54px] md:pt-[56px] w-full">
          <HeroBanner />
        </div>
        
        {/* Séparateur avec espacement adaptatif minimal */}
        <div className="w-full flex justify-center my-[0.15rem] xs:my-[0.2rem] sm:my-[0.25rem]">
          <Separator className="max-w-7xl w-[98%]" />
        </div>
        
        {/* Contenu principal avec espacements adaptatifs */}
        <div className="py-[0.5rem] xs:py-[0.75rem] sm:py-[1rem] md:py-[1.25rem] w-full">
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
