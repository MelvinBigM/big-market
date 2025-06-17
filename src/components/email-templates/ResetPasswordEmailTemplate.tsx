
export const ResetPasswordEmailTemplate = (resetUrl: string, email: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Réinitialisation de votre mot de passe - Big Market</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://big-market.lovable.app/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
             alt="Big Market Logo" 
             style="height: 60px; width: 60px;">
    </div>
    
    <h2 style="color: #1f2937; text-align: center; margin-bottom: 30px;">Réinitialisation de votre mot de passe</h2>

    <p>Bonjour,</p>

    <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Big Market associé à l'adresse email :</p>
    
    <p style="text-align: center; font-weight: bold; color: #3B82F6; margin: 20px 0;">
        ${email}
    </p>

    <p>Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>

    <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Réinitialiser mon mot de passe
        </a>
    </p>

    <p><strong>Informations importantes :</strong></p>
    <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Ce lien est valide pendant 1 heure</li>
        <li>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email</li>
        <li>Pour votre sécurité, ne partagez ce lien avec personne</li>
        <li>Pour toute question, contactez-nous à contact@bigimex.fr</li>
    </ul>

    <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
        ${resetUrl}
    </p>

    <p>Cordialement,<br>
    L'équipe Big Market</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
    <p style="font-size: 12px; color: #666; text-align: center;">
        Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe sur Big Market.<br>
        Big Market - Votre plateforme B2B de confiance
    </p>
</body>
</html>
`;
