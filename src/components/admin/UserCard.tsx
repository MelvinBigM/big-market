import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Mail, Trash2, ArrowRight, Building2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedRateLimiter, logSecurityEvent, SecurityEventTypes } from "@/lib/enhancedRateLimiting";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserProfile extends Profile {
  email: string | null;
}

interface UserCardProps {
  userProfile: UserProfile;
  onRoleChange: (userId: string, newRole: 'nouveau' | 'client' | 'admin') => void;
  onDelete: (userId: string) => void;
}

const UserCard = ({ userProfile, onRoleChange, onDelete }: UserCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const displayName = userProfile.company_name;

  const handleDelete = async () => {
    // Log admin action for security monitoring
    await logSecurityEvent(SecurityEventTypes.ADMIN_ACTION, {
      action: 'user_delete_attempt',
      target_user_id: userProfile.id,
      target_company: userProfile.company_name
    });
    
    onDelete(userProfile.id);
    setIsDeleteDialogOpen(false);
  };

  const handleRoleChange = async (newRole: 'nouveau' | 'client' | 'admin') => {
    // Check rate limiting for admin actions
    const currentUserId = 'current-admin-id'; // This should come from auth context
    if (!EnhancedRateLimiter.checkAdminActionRateLimit(currentUserId, 'role_change')) {
      toast.error("Trop d'actions administratives. Veuillez patienter.");
      return;
    }

    // Log admin action for security monitoring
    await logSecurityEvent(SecurityEventTypes.ADMIN_ACTION, {
      action: 'role_change_attempt',
      target_user_id: userProfile.id,
      old_role: userProfile.role,
      new_role: newRole,
      target_company: userProfile.company_name
    });
    
    onRoleChange(userProfile.id, newRole);
  };

  const handleSendEmail = async () => {
    if (!userProfile.email) {
      toast.error("Aucune adresse email disponible pour cet utilisateur");
      return;
    }

    // Log data access for security monitoring
    await logSecurityEvent(SecurityEventTypes.DATA_ACCESS, {
      action: 'email_contact',
      target_user_id: userProfile.id,
      target_email: userProfile.email
    });

    const subject = `Contact depuis l'administration - ${displayName || 'Votre compte'}`;
    const body = `Bonjour,\n\nNous vous contactons concernant votre compte.\n\nCordialement,\nL'équipe d'administration`;
    
    const mailtoUrl = `mailto:${userProfile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
    toast.success(`Email ouvert pour ${userProfile.email}`);
  };

  if (isMobile) {
    return (
      <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-3 space-y-3 overflow-hidden">
        {/* Header avec nom et bouton d'actions */}
        <div className="flex items-start justify-between min-w-0">
          <button
            onClick={() => navigate(`/admin/users/${userProfile.id}`)}
            className="font-medium hover:text-primary flex items-center gap-2 flex-1 text-left min-w-0 mr-2"
          >
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">{displayName || 'Nom de société non défini'}</span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={handleSendEmail}
                disabled={!userProfile.email}
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate(`/admin/users/${userProfile.id}`)}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Informations utilisateur */}
        <div className="space-y-1 text-xs min-w-0">
          <p className="text-gray-600 truncate">
            {userProfile.email || 'Email non défini'}
          </p>
          <p className="text-gray-500">
            Inscrit le {new Date(userProfile.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Sélecteur de rôle */}
        <div className="w-full">
          <Select
            value={userProfile.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base">Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Êtes-vous sûr de vouloir supprimer l'utilisateur "{displayName || 'Utilisateur sans nom'}" ? 
                Cette action est irréversible et supprimera définitivement le compte utilisateur.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Version desktop (code existant)
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate(`/admin/users/${userProfile.id}`)}
            className="font-medium hover:text-primary flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {displayName || 'Nom de société non défini'}
            </div>
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-sm text-gray-600">
            {userProfile.email || 'Email non défini'}
          </p>
          <p className="text-xs text-gray-500">
            Inscrit le {new Date(userProfile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Select
          value={userProfile.role}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nouveau">Nouveau</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendEmail}
            disabled={!userProfile.email}
            title={userProfile.email ? `Envoyer un email à ${userProfile.email}` : "Aucune adresse email disponible"}
          >
            <Mail className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'utilisateur "{displayName || 'Utilisateur sans nom'}" ? 
                  Cette action est irréversible et supprimera définitivement le compte utilisateur.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
