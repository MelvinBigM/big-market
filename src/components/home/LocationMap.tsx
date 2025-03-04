
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LocationMap = () => {
  const handleOpenGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/JPccmraZVscgLL5u7", "_blank");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Retrouvez-nous</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="overflow-hidden shadow-md border-none">
              <CardContent className="p-0">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.5429189232896!2d6.937453375869258!3d43.55261895887715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ce8c1320fbf0a5%3A0xe901e493c9a1b4d8!2s42%20Chem.%20de%20l&#39;Escadrille%2C%2006210%20Mandelieu-la-Napoule!5e0!3m2!1sfr!2sfr!4v1718458531594!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps - BIG IMEX location"
                  className="rounded-lg"
                ></iframe>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold">Nos coordonnées</h3>
            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={handleOpenGoogleMaps}
              >
                <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-center">
                  <p className="font-medium flex items-center justify-center mb-1">
                    Adresse <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                  </p>
                  <p className="text-gray-600">42 Chemin de l'escadrille</p>
                  <p className="text-gray-600">06210 Mandelieu</p>
                  <p className="text-gray-600">FRANCE</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-center">
                  <p className="font-medium mb-1">Téléphone</p>
                  <p className="text-gray-600">04 93 90 90 92</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-center">
                  <p className="font-medium mb-1">Email</p>
                  <p className="text-gray-600">contact@bigimex.fr</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
