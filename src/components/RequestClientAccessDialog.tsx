
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AccessRequest } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestClientAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestClientAccessDialog = ({ open, onOpenChange }: RequestClientAccessDialogProps) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Vérifier si l'utilisateur a déjà une demande en attente
  const { data: existingRequest, isLoading: checkingRequest } = useQuery({
    queryKey: ["user-access-request", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from("access_requests")
        .select("*")
        .eq("user_id", profile.id)
        .eq("status", "pending")
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = Not found
        throw error;
      }
      
      return data as AccessRequest | null;
    },
    enabled: !!profile?.id && open,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("access_requests")
        .insert({
          user_id: profile.id,
          reason,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Votre demande d'accès a été envoyée avec succès");
      // Invalider la requête pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ["user-access-request", profile.id] });
      queryClient.invalidateQueries({ queryKey: ["has-access-request", profile.id] });
      onOpenChange(false);
      setReason("");
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande");
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser le formulaire quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Demande d'accès client</DialogTitle>
          <DialogDescription>
            {existingRequest 
              ? "Votre demande d'accès est en cours d'examen par notre équipe" 
              : "Expliquez-nous pourquoi vous souhaitez obtenir un accès client à notre catalogue"}
          </DialogDescription>
        </DialogHeader>
        
        {checkingRequest ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : existingRequest ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-center text-muted-foreground">
              Votre demande a été soumise le {formatDate(existingRequest.created_at)}. 
              Nous l'examinerons dans les plus brefs délais.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => onOpenChange(false)}>Fermer</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motif de la demande</Label>
              <Textarea
                id="reason"
                placeholder="Expliquez votre activité et vos besoins..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Envoi..." : "Envoyer la demande"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestClientAccessDialog;
