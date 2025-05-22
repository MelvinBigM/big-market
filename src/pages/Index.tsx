
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
      <main className="flex-1 pt-16">
        <HeroBanner />
        <Separator className="max-w-7xl mx-auto border-t" />
        <LatestProducts />
        <Separator className="max-w-7xl mx-auto my-6 border-t" />
        <LocationMap />
        <Separator className="max-w-7xl mx-auto my-6 border-t" />
        <OpeningHours />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
