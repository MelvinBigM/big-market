
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import LatestProducts from "@/components/home/LatestProducts";
import LocationMap from "@/components/home/LocationMap";
import OpeningHours from "@/components/home/OpeningHours";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroBanner />
      <LatestProducts />
      <LocationMap />
      <OpeningHours />
      <Footer />
    </div>
  );
};

export default Index;
