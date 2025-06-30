#!/bin/bash

# Script de configuration Nginx pour Big Market
# À exécuter sur le VPS Ubuntu 22.04

echo "🌐 Configuration de Nginx..."

# Copie de la configuration
cp /var/www/big-market/deploy/nginx-config /etc/nginx/sites-available/big-market

# Activation du site
ln -sf /etc/nginx/sites-available/big-market /etc/nginx/sites-enabled/

# Suppression de la configuration par défaut
rm -f /etc/nginx/sites-enabled/default

# Test de la configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration Nginx valide"
    
    # Redémarrage de Nginx
    systemctl reload nginx
    systemctl restart nginx
    
    echo "🎉 Nginx configuré et redémarré avec succès !"
    echo "🌐 Votre site est maintenant accessible sur http://84.234.18.206"
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi 