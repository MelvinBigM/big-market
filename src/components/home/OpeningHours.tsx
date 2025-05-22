import { motion } from "framer-motion";
const OpeningHours = () => {
  return <section className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center">
          <h2 className="text-3xl font-bold">Horaires d'ouverture</h2>
          
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
    </section>;
};
export default OpeningHours;