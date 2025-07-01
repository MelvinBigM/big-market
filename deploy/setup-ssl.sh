#!/bin/bash

# Script de configuration SSL pour Big Market
# Configure automatiquement HTTPS pour big-market.fr et www.big-market.fr

DOMAIN="big-market.fr"
EMAIL="admin@big-market.fr"

echo "🔒 Configuration SSL pour Big Market"
echo "===================================="

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

# Vérification que Certbot est installé
if ! command -v certbot >/dev/null 2>&1; then
    echo "❌ Certbot n'est pas installé"
    echo "🔧 Installation de Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Vérification que Nginx fonctionne
if ! systemctl is-active --quiet nginx; then
    echo "❌ Nginx n'est pas actif"
    echo "🚀 Démarrage de Nginx..."
    systemctl start nginx
fi

# Test de résolution DNS
echo "🔍 Vérification du DNS..."
if nslookup $DOMAIN | grep -q "84.234.18.206"; then
    echo "✅ DNS correctement configuré"
else
    echo "❌ DNS non configuré correctement"
    echo "Vérifiez que $DOMAIN pointe vers 84.234.18.206"
    exit 1
fi

# Test d'accès HTTP
echo "🌐 Test d'accès HTTP..."
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|404\|403"; then
    echo "✅ Site accessible en HTTP"
else
    echo "❌ Site non accessible en HTTP"
    echo "Vérifiez la configuration Nginx"
    exit 1
fi

# Installation du certificat SSL
echo "🔒 Installation du certificat SSL..."
echo "📧 Email utilisé: $EMAIL"

if certbot --nginx \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect; then
    
    echo "✅ Certificat SSL installé avec succès !"
    
    # Configuration du renouvellement automatique
    echo "🔄 Configuration du renouvellement automatique..."
    
    # Créer un cron job pour le renouvellement
    if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        echo "✅ Renouvellement automatique configuré"
    else
        echo "ℹ️  Renouvellement automatique déjà configuré"
    fi
    
    # Test du renouvellement
    echo "🧪 Test du renouvellement..."
    if certbot renew --dry-run; then
        echo "✅ Test de renouvellement réussi"
    else
        echo "⚠️  Problème avec le test de renouvellement"
    fi
    
    # Redémarrage de Nginx pour appliquer les changements
    echo "🔄 Redémarrage de Nginx..."
    systemctl reload nginx
    
    echo ""
    echo "🎉 SSL configuré avec succès !"
    echo "=============================="
    echo ""
    echo "🌐 Votre site est maintenant accessible en HTTPS :"
    echo "   👉 https://big-market.fr"
    echo "   👉 https://www.big-market.fr"
    echo ""
    echo "🔒 Sécurité :"
    echo "   • Certificat Let's Encrypt installé"
    echo "   • Redirection HTTP → HTTPS activée"
    echo "   • Renouvellement automatique configuré"
    echo ""
    echo "📊 Vérifications :"
    echo "   • Test SSL: https://www.ssllabs.com/ssltest/"
    echo "   • Certificats: sudo certbot certificates"
    echo "   • Logs SSL: tail -f /var/log/letsencrypt/letsencrypt.log"
    
else
    echo "❌ Erreur lors de l'installation SSL"
    echo ""
    echo "🔧 Vérifications à faire :"
    echo "   1. DNS correctement configuré"
    echo "   2. Site accessible en HTTP"
    echo "   3. Pas de limitation de taux Let's Encrypt"
    echo "   4. Ports 80 et 443 ouverts"
    echo ""
    echo "💡 Réessayez dans quelques minutes avec :"
    echo "   sudo ./setup-ssl.sh"
    exit 1
fi

# Test final HTTPS
echo ""
echo "🔍 Test final HTTPS..."
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200\|404\|403"; then
    echo "✅ HTTPS fonctionne parfaitement !"
else
    echo "⚠️  HTTPS ne répond pas encore, attendez quelques secondes"
fi

echo ""
echo "🎯 Configuration SSL terminée !" 