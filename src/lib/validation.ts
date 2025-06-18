
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email.trim()) {
    return { isValid: false, error: "L'adresse email est obligatoire" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Format d'adresse email invalide" };
  }
  
  if (email.length > 255) {
    return { isValid: false, error: "L'adresse email est trop longue" };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Le mot de passe est obligatoire" };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: "Le mot de passe doit contenir au moins 6 caractères" };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: "Le mot de passe est trop long" };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
  
  if (!phone.trim()) {
    return { isValid: false, error: "Le numéro de téléphone est obligatoire" };
  }
  
  const cleanPhone = phone.replace(/\s/g, "");
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: "Format de téléphone invalide (format français attendu)" };
  }
  
  return { isValid: true };
};

export const validatePostalCode = (postalCode: string): { isValid: boolean; error?: string } => {
  const postalCodeRegex = /^[0-9]{5}$/;
  
  if (!postalCode.trim()) {
    return { isValid: false, error: "Le code postal est obligatoire" };
  }
  
  if (!postalCodeRegex.test(postalCode)) {
    return { isValid: false, error: "Le code postal doit contenir exactement 5 chiffres" };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML characters
    .substring(0, 1000); // Limit length
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} est obligatoire` };
  }
  
  if (value.trim().length < 2) {
    return { isValid: false, error: `${fieldName} doit contenir au moins 2 caractères` };
  }
  
  return { isValid: true };
};
