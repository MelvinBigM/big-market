
export const WelcomeEmailTemplate = (confirmationUrl: string, companyName: string, managerName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenue chez Big Market !</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://big-market.lovable.app/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
             alt="Big Market Logo" 
             style="height: 60px; width: 60px;">
    </div>
    
    <h2 style="color: #1f2937; text-align: center; margin-bottom: 30px;">Bienvenue chez Big Market !</h2>

    <p>Bonjour ${managerName},</p>

    <p>Merci d'avoir inscrit <strong>${companyName}</strong> sur notre plateforme Big Market. Pour finaliser votre inscription et accéder à votre compte entreprise, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>

    <p style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" 
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Confirmer mon inscription
        </a>
    </p>

    <p>Une fois votre email confirmé, notre équipe examinera votre demande d'accès dans les plus brefs délais.</p>

    <p><strong>Informations importantes :</strong></p>
    <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Ce lien est valide pendant 24 heures</li>
        <li>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email</li>
        <li>Pour toute question, contactez-nous à contact@bigimex.fr</li>
    </ul>

    <p>Cordialement,<br>
    L'équipe Big Market</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
    <p style="font-size: 12px; color: #666; text-align: center;">
        Vous recevez cet email car vous avez créé un compte sur Big Market.<br>
        Big Market - Votre plateforme B2B de confiance
    </p>
</body>
</html>
`;
