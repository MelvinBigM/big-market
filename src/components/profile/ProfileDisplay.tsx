
import React from "react";
import { UserProfileData } from "@/types/profile";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/lib/types";

interface ProfileDisplayProps {
  userData: UserProfileData;
  profile: Profile | null;
}

const ProfileDisplay = ({ userData, profile }: ProfileDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">
            {userData?.is_company ? "Nom de l'entreprise" : "Nom complet"}
          </p>
          <p className="mt-1">{userData?.full_name || "-"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Téléphone</p>
          <p className="mt-1">{userData?.phone_number || "-"}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-3">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Adresse</p>
            <p className="mt-1">{userData?.address || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ville</p>
            <p className="mt-1">{userData?.city || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Code postal</p>
            <p className="mt-1">{userData?.postal_code || "-"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-sm font-medium text-gray-500">Type de compte</p>
        <p className="mt-1">
          {profile?.role === 'admin' 
            ? 'Administrateur' 
            : profile?.role === 'client' 
              ? 'Client validé' 
              : "Compte en attente d'approbation"}
        </p>
      </div>
    </div>
  );
};

export default ProfileDisplay;
