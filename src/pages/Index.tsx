
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
        {/* Bannière avec espacement responsive */}
        <div className="pt-[60px] sm:pt-[72px]">
          <HeroBanner />
        </div>
        {/* Séparateur avec espace adaptatif */}
        <div className="w-full flex justify-center">
          <Separator className="max-w-7xl w-[90%]" />
        </div>
        {/* Contenu principal avec espacement responsive */}
        <div className="py-6 sm:py-8 md:py-10 w-full">
          <LatestProducts />
          <Separator className="my-6 sm:my-8 md:my-10 max-w-7xl mx-auto w-[90%]" />
          <LocationMap />
          <Separator className="my-6 sm:my-8 md:my-10 max-w-7xl mx-auto w-[90%]" />
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
