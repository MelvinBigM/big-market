import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Layers, Package, UserCheck, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { NotificationBadge } from "../ui/notification-badge";
import { useAccessRequests } from "@/hooks/useAccessRequests";

const AdminDashboard = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useAccessRequests();
  
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
      notificationCount: 0,
    },
    {
      title: "Gestion des catégories",
      description: "Ajouter, modifier et supprimer des catégories de produits",
      icon: <Layers className="h-8 w-8" />,
      link: "/admin/categories",
      color: "bg-green-500",
      notificationCount: 0,
    },
    {
      title: "Gestion des produits",
      description: "Gérer le catalogue de produits",
      icon: <Package className="h-8 w-8" />,
      link: "/admin/products",
      color: "bg-purple-500",
      notificationCount: 0,
    },
    {
      title: "Demandes d'accès",
      description: "Gérer les demandes d'accès client",
      icon: <UserCheck className="h-8 w-8" />,
      link: "/admin/access-requests",
      color: "bg-yellow-500",
      notificationCount: pendingCount,
    },
    {
      title: "Bannières",
      description: "Gérer les bannières de la page d'accueil",
      icon: <ImageIcon className="h-8 w-8" />,
      link: "/admin/banners",
      color: "bg-pink-500",
      notificationCount: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Administration
          </h1>
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
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center p-3 rounded-lg ${card.color} text-white mb-4`}>
                      {card.icon}
                    </div>
                    {card.notificationCount > 0 && (
                      <NotificationBadge 
                        count={card.notificationCount} 
                        className="absolute -top-2 -right-2 scale-75"
                      />
                    )}
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
