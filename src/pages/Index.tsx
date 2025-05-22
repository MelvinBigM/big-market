
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
      <main className="flex flex-col pt-16 sm:pt-20">
        {/* Bannière avec espacement optimisé */}
        <div className="pt-2 sm:pt-4">
          <HeroBanner />
        </div>
        {/* Séparateur avec espace réduit en dessous de la bannière */}
        <div className="w-full flex justify-center mt-0 sm:-mt-1%">
          <Separator className="max-w-7xl w-[90%] sm:w-[85%] lg:w-[80%]" />
        </div>
        {/* Contenu principal avec espacement amélioré */}
        <div className="py-4 sm:py-6 md:py-8">
          <LatestProducts />
          <Separator className="my-4 sm:my-6 md:my-8 max-w-7xl mx-auto w-[90%] sm:w-[85%] lg:w-[80%]" />
          <LocationMap />
          <Separator className="my-4 sm:my-6 md:my-8 max-w-7xl mx-auto w-[90%] sm:w-[85%] lg:w-[80%]" />
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
