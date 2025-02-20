
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
}

const UserCard = ({ userProfile, onRoleChange }: UserCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="space-y-1">
          <h3 className="font-medium">{userProfile.email || 'Email non défini'}</h3>
          <p className="text-sm text-gray-600">
            {userProfile.full_name || 'Nom non défini'}
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
            onClick={() => {
              toast.info("Fonctionnalité à venir");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
