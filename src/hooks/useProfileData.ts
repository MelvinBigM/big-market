
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserProfileData } from "@/types/profile";

// Initial form data state
const initialFormData = {
  full_name: "",
  is_company: false,
  phone_number: "",
  address: "",
  city: "",
  postal_code: "",
};

export const useProfileData = () => {
  const { session, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // Fetch user profile data
  const { 
    data: userData, 
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID not available");
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data retrieved:", data);
      return data as UserProfileData;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || "",
        is_company: userData.is_company || false,
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        city: userData.city || "",
        postal_code: userData.postal_code || "",
      });
    }
  }, [userData]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: Partial<UserProfileData>) => {
      if (!userId) {
        throw new Error("User ID not available");
      }
      
      // Make sure we're updating the correct user record
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", userId)
        .select();

      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Profil mis à jour avec succès");
      
      // Exit edit mode
      setIsEditing(false);
      
      // Refresh the profile in auth context
      refreshProfile();
      
      // Invalidate the cache
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      
      // Force refetch after a short delay
      setTimeout(() => {
        refetch();
      }, 300);
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Form handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, is_company: checked }));
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    updateProfileMutation.mutate(formData);
  }, [formData, updateProfileMutation]);

  // Refetch profile data
  const refetchProfileData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    userData,
    formData,
    isLoading,
    isError,
    isEditing,
    setIsEditing,
    isSubmitting: updateProfileMutation.isPending,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    refetchProfileData
  };
};
