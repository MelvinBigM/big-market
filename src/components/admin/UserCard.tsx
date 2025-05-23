
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Mail, Trash2, ArrowRight, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const displayName = userProfile.company_name;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
          onValueChange={(value: 'nouveau' | 'client' | 'admin') => 
            onRoleChange(userProfile.id, value)
          }
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
            onClick={() => {
              toast.info("Fonctionnalité à venir");
            }}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(userProfile.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
