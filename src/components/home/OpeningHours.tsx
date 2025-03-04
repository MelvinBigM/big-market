
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OpeningHours = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-semibold">Horaires d'ouverture</h3>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between items-center border-b pb-4 border-gray-100">
                  <p className="font-medium text-lg">Lundi - Vendredi</p>
                  <p className="text-gray-700 text-xl font-medium">8h00 - 16h00</p>
                </div>
                
                <div className="flex justify-between items-center border-b pb-4 border-gray-100">
                  <p className="font-medium text-lg">Samedi</p>
                  <p className="text-gray-700 text-xl font-medium">9h00 - 14h00</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="font-medium text-lg">Dimanche</p>
                  <p className="text-gray-700 text-xl font-medium">Fermé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default OpeningHours;
