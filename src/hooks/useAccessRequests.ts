
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAccessRequests() {
  const { data: pendingCount, isLoading } = useQuery({
    queryKey: ["pending-access-requests-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("access_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      
      if (error) {
        console.error("Error fetching pending access requests:", error);
        return 0;
      }
      
      return count || 0;
    },
    // Check for new pending requests every minute
    refetchInterval: 60000,
  });

  return {
    pendingCount: pendingCount || 0,
    isLoading,
  };
}
