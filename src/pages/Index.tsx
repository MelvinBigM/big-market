
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
      <main className="flex flex-col">
        {/* Bannière avec espacement optimisé */}
        <div className="pt-2%">
          <HeroBanner />
        </div>
        {/* Séparateur avec espace réduit en dessous de la bannière */}
        <div className="w-full flex justify-center -mt-1%">
          <Separator className="max-w-7xl w-[90%]" />
        </div>
        {/* Contenu principal avec espacement amélioré */}
        <div className="py-4% md:py-3%">
          <LatestProducts />
          <Separator className="my-3% max-w-7xl mx-auto w-[90%]" />
          <LocationMap />
          <Separator className="my-3% max-w-7xl mx-auto w-[90%]" />
          <OpeningHours />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
