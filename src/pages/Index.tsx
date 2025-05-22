
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
        {/* Bannière avec espacement ultra-minimal */}
        <div className="pt-[16px] xs:pt-[18px] sm:pt-[20px] md:pt-[24px] w-full">
          <HeroBanner />
        </div>
        
        {/* Séparateur avec espacement ultra-minimal */}
        <div className="w-full flex justify-center my-[0.05rem] xs:my-[0.06rem] sm:my-[0.08rem]">
          <Separator className="max-w-7xl w-[99%]" />
        </div>
        
        {/* Contenu principal avec espacements réduits */}
        <div className="py-[0.15rem] xs:py-[0.25rem] sm:py-[0.3rem] md:py-[0.4rem] w-full">
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
