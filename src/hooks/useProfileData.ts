
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
  const { session, profile, refreshProfile } = useAuth();
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
      
      console.log("Fetching profile for user ID:", userId);
      
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
      console.log("Updating form with retrieved data:", userData);
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
      
      console.log("Sending profile update with data:", updatedData);
      
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", userId);

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: async () => {
      // Refresh profile in auth context
      await refreshProfile();
      
      // Invalidate and refetch query
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      
      // Show success message
      toast.success("Profil mis à jour avec succès");
      
      // Exit edit mode
      setIsEditing(false);
      
      // Force refetch to ensure we have the latest data
      refetch();
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  // Form input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, is_company: checked }));
  }, []);

  // Submit handler
  const handleSubmit = useCallback(() => {
    console.log("Submitting profile update with form data:", formData);
    updateProfileMutation.mutate(formData);
  }, [formData, updateProfileMutation]);

  return {
    userData,
    formData,
    isLoading,
    isError,
    error,
    isEditing,
    setIsEditing,
    isSubmitting: updateProfileMutation.isPending,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    refetchProfile: refetch
  };
};
