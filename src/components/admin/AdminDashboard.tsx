
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Layers, Package, UserCheck, MessageCircle, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../NavBar";
import Footer from "../Footer";

const AdminDashboard = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  const cards = [
    {
      title: "Gestion des clients",
      description: "Créer et gérer les comptes clients",
      icon: <Users className="h-8 w-8" />,
      link: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Gestion des catégories",
      description: "Ajouter, modifier et supprimer des catégories de produits",
      icon: <Layers className="h-8 w-8" />,
      link: "/admin/categories",
      color: "bg-green-500",
    },
    {
      title: "Gestion des produits",
      description: "Gérer le catalogue de produits",
      icon: <Package className="h-8 w-8" />,
      link: "/admin/products",
      color: "bg-purple-500",
    },
    {
      title: "Demandes d'accès",
      description: "Gérer les demandes d'accès client",
      icon: <UserCheck className="h-8 w-8" />,
      link: "/admin/access-requests",
      color: "bg-yellow-500",
    },
    {
      title: "Conversations",
      description: "Gérer les conversations avec les clients",
      icon: <MessageCircle className="h-8 w-8" />,
      link: "/admin/chat",
      color: "bg-indigo-500",
    },
    {
      title: "Bannières",
      description: "Gérer les bannières de la page d'accueil",
      icon: <ImageIcon className="h-8 w-8" />,
      link: "/admin/banners",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
              alt="Big Market Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Administration
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={card.link}
                className="block h-full"
              >
                <div className="bg-white rounded-lg shadow-sm p-6 h-full hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg ${card.color} text-white mb-4`}>
                    {card.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-gray-600">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
