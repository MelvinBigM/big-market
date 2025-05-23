import { toast } from "sonner";

export const REQUIRED_WIDTH = 1920;
export const REQUIRED_HEIGHT = 250;

/**
 * Validates image dimensions to ensure they match requirements
 */
export const validateImageDimensions = (
  file: File,
  setImageError: (error: string | null) => void
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const valid = img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT;
      if (!valid) {
        setImageError(
          `L'image doit être exactement de ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT} pixels. Dimensions actuelles: ${img.width}x${img.height}`
        );
      } else {
        setImageError(null);
      }
      resolve(valid);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validates image file before upload (type, size, dimensions)
 */
export const validateImageFile = async (
  file: File,
  setImageError: (error: string | null) => void
): Promise<boolean> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error("Le fichier doit être une image");
    return false;
  }

  // Max size: 2MB
  if (file.size > 2 * 1024 * 1024) {
    toast.error("L'image ne doit pas dépasser 2MB");
    return false;
  }

  // Validate dimensions - more flexible for mobile display
  return await validateImageDimensions(file, setImageError);
};
