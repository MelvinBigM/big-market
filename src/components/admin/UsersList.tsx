
import { Profile } from "@/lib/types";
import UserCard from "./UserCard";

interface UserProfile extends Profile {
  email: string | null;
}

interface UsersListProps {
  profiles: UserProfile[] | undefined;
  onRoleChange: (userId: string, newRole: 'nouveau' | 'client' | 'admin') => void;
  onDelete: (userId: string) => void;
}

const UsersList = ({ profiles, onRoleChange, onDelete }: UsersListProps) => {
  if (!profiles || profiles.length === 0) {
    return (
      <p className="text-center text-gray-600 py-4 px-4">
        Aucun utilisateur trouvé.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {profiles.map((userProfile) => (
        <UserCard
          key={userProfile.id}
          userProfile={userProfile}
          onRoleChange={onRoleChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UsersList;
