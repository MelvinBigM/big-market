
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const OpeningHours = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Clock className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-2xl font-semibold">Horaires d'ouverture</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-lg mb-2">Lundi - Samedi</p>
              <p className="text-gray-600 text-xl">8h00 - 16h00</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-lg mb-2">Dimanche</p>
              <p className="text-gray-600 text-xl">Fermé</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpeningHours;
