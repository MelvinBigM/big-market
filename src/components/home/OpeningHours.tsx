
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const OpeningHours = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-5 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">Horaires d'ouverture</h3>
          </div>
          
          <div className="bg-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50/50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-700 mb-1">Lundi - Vendredi</p>
                <p className="text-primary text-xl font-medium">8h00 - 16h00</p>
              </div>
              
              <div className="bg-blue-50/50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-700 mb-1">Samedi</p>
                <p className="text-primary text-xl font-medium">9h00 - 14h00</p>
              </div>
              
              <div className="bg-blue-50/50 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-700 mb-1">Dimanche</p>
                <p className="text-primary text-xl font-medium">Fermé</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpeningHours;
