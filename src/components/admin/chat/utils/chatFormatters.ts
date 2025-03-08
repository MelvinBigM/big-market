
/**
 * Utility functions for chat formatting
 */

// Format date function for displaying chat messages
export const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
};
