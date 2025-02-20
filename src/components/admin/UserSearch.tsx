
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const UserSearch = ({ searchQuery, setSearchQuery }: UserSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un utilisateur par email, nom ou rôle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>
    </div>
  );
};

export default UserSearch;
