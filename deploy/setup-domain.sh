#!/bin/bash

# Script de configuration d'un nom de domaine pour Big Market
# Usage: sudo ./setup-domain.sh votre-domaine.com

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Usage: sudo ./setup-domain.sh votre-domaine.com"
    exit 1
fi

if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

echo "🌐 Configuration du domaine: $DOMAIN"
echo "====================================="

# Vérification que Nginx est installé
if ! command -v nginx >/dev/null 2>&1; then
    echo "❌ Nginx n'est pas installé"
    exit 1
fi

# Sauvegarde de la configuration actuelle
echo "💾 Sauvegarde de la configuration Nginx..."
cp /etc/nginx/sites-available/big-market /etc/nginx/sites-available/big-market.backup.$(date +%Y%m%d-%H%M%S)

# Modification de la configuration Nginx
echo "🔧 Mise à jour de la configuration Nginx..."
sed -i "s/server_name 84.234.18.206 _;/server_name $DOMAIN www.$DOMAIN 84.234.18.206;/" /etc/nginx/sites-available/big-market

# Test de la configuration
echo "🔍 Test de la configuration Nginx..."
if nginx -t; then
    echo "✅ Configuration Nginx valide"
    systemctl reload nginx
else
    echo "❌ Erreur dans la configuration Nginx"
    echo "🔄 Restauration de la sauvegarde..."
    cp /etc/nginx/sites-available/big-market.backup.$(date +%Y%m%d)* /etc/nginx/sites-available/big-market
    systemctl reload nginx
    exit 1
fi

# Vérification de la résolution DNS
echo "🔍 Vérification de la résolution DNS..."
if nslookup $DOMAIN | grep -q "84.234.18.206"; then
    echo "✅ DNS configuré correctement"
    
    # Test d'accès HTTP
    echo "🌐 Test d'accès HTTP..."
    if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|404\|403"; then
        echo "✅ Site accessible via HTTP"
        
        # Configuration SSL
        echo "🔒 Configuration SSL avec Certbot..."
        echo "⚠️  Assurez-vous que votre DNS est bien propagé avant de continuer"
        read -p "Voulez-vous installer le certificat SSL maintenant ? (y/n): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
                echo "✅ Certificat SSL installé avec succès !"
                echo "🔒 Votre site est maintenant accessible en HTTPS"
                echo "   👉 https://$DOMAIN"
                echo "   👉 https://www.$DOMAIN"
            else
                echo "❌ Erreur lors de l'installation SSL"
                echo "💡 Vérifiez que votre DNS est bien propagé et réessayez :"
                echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
            fi
        else
            echo "ℹ️  Vous pouvez installer SSL plus tard avec :"
            echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        fi
    else
        echo "⚠️  Site pas encore accessible via $DOMAIN"
        echo "🕐 Attendez que le DNS se propage (15 minutes à 2 heures)"
    fi
else
    echo "⚠️  DNS pas encore propagé pour $DOMAIN"
    echo "📋 Vérifiez votre configuration DNS chez Infomaniak :"
    echo "   Type: A, Nom: @, Valeur: 84.234.18.206"
    echo "   Type: A, Nom: www, Valeur: 84.234.18.206"
    echo ""
    echo "🕐 Attendez la propagation puis relancez :"
    echo "   sudo ./setup-domain.sh $DOMAIN"
fi

echo ""
echo "✅ Configuration du domaine terminée !"
echo "======================================"
echo ""
echo "🌐 Vos sites sont accessibles sur :"
echo "   • http://84.234.18.206 (IP directe)"
echo "   • http://$DOMAIN (nouveau domaine)"
echo "   • http://www.$DOMAIN (avec www)"
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "   • https://$DOMAIN (sécurisé)"
    echo "   • https://www.$DOMAIN (sécurisé)"
fi
echo ""
echo "📊 Commandes de vérification :"
echo "   • nslookup $DOMAIN"
echo "   • curl -I http://$DOMAIN"
echo "   • sudo certbot certificates" 