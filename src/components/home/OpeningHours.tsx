
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const OpeningHours = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-8">
            <Clock className="h-6 w-6 text-primary mr-2" />
            <h3 className="text-2xl font-semibold text-gray-800">Horaires d'ouverture</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="pb-4">
              <p className="font-medium text-lg text-gray-700">Lundi - Samedi</p>
              <p className="text-primary text-xl font-medium mt-2">8h00 - 16h00</p>
            </div>
            
            <div className="pb-4">
              <p className="font-medium text-lg text-gray-700">Dimanche</p>
              <p className="text-primary text-xl font-medium mt-2">Fermé</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpeningHours;
