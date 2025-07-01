#!/bin/bash

# Script de configuration Nginx pour Big Market
# À exécuter sur le VPS Ubuntu 22.04

echo "🌐 Configuration de Nginx..."

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

# Vérification que Nginx est installé
if ! command -v nginx >/dev/null 2>&1; then
    echo "❌ Nginx n'est pas installé. Exécutez d'abord install-prerequisites.sh"
    exit 1
fi

# Vérification de l'existence du fichier de configuration
CONFIG_SOURCE="/var/www/big-market/deploy/nginx-config"
CONFIG_DEST="/etc/nginx/sites-available/big-market"

if [ ! -f "$CONFIG_SOURCE" ]; then
    echo "❌ Fichier de configuration nginx-config introuvable dans $CONFIG_SOURCE"
    echo "🔧 Création de la configuration Nginx..."
    
    # Création du fichier de configuration directement
    cat > "$CONFIG_DEST" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name big-market.fr www.big-market.fr 84.234.18.206;

    root /var/www/big-market/dist;
    index index.html index.htm;

    # Logs spécifiques à l'application
    access_log /var/log/nginx/big-market-access.log;
    error_log /var/log/nginx/big-market-error.log warn;

    # Taille maximale des uploads
    client_max_body_size 10M;

    # Gestion des fichiers statiques - SPA React Router
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers de sécurité pour les pages HTML
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
        
        # Cache court pour les pages HTML
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }

    # Assets statiques avec cache long
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable" always;
        add_header Vary "Accept-Encoding" always;
        
        # Gestion des erreurs 404 pour les assets
        try_files $uri =404;
    }

    # Fichiers de manifeste et robots
    location ~* \.(manifest|webmanifest|xml|txt)$ {
        expires 1w;
        add_header Cache-Control "public" always;
    }

    # Sécurité - Bloquer les fichiers sensibles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~* \.(env|config|log|sql|bak|backup|old|orig)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Headers de sécurité globaux
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://shfleoigdsgvmdfijaqi.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://shfleoigdsgvmdfijaqi.supabase.co wss://shfleoigdsgvmdfijaqi.supabase.co; frame-ancestors 'none';" always;

    # Compression optimisée
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/atom+xml
        application/geo+json
        application/javascript
        application/x-javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rdf+xml
        application/rss+xml
        application/xhtml+xml
        application/xml
        font/eot
        font/otf
        font/ttf
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml
        text/x-component;

    # Page d'erreur personnalisée
    error_page 404 /index.html;
    error_page 500 502 503 504 /index.html;
}
EOF
    echo "✅ Configuration créée directement"
else
    echo "📄 Copie de la configuration depuis le repository..."
    cp "$CONFIG_SOURCE" "$CONFIG_DEST"
fi

# Vérification que le dossier dist existe
if [ ! -d "/var/www/big-market/dist" ]; then
    echo "⚠️ Le dossier /var/www/big-market/dist n'existe pas encore"
    echo "ℹ️ Il sera créé lors du déploiement de l'application"
fi

# Sauvegarde de la configuration par défaut
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo "💾 Sauvegarde de la configuration par défaut..."
    mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup.$(date +%Y%m%d-%H%M%S)
fi

# Activation du site
echo "🔗 Activation du site..."
ln -sf /etc/nginx/sites-available/big-market /etc/nginx/sites-enabled/

# Suppression des liens symboliques cassés
echo "🧹 Nettoyage des configurations orphelines..."
find /etc/nginx/sites-enabled/ -xtype l -delete 2>/dev/null || true

# Test de la configuration
echo "🔍 Test de la configuration Nginx..."
if nginx -t 2>/dev/null; then
    echo "✅ Configuration Nginx valide"
    
    # Redémarrage de Nginx
    echo "🔄 Redémarrage de Nginx..."
    systemctl reload nginx
    systemctl restart nginx
    
    # Vérification du statut
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx démarré avec succès"
        
        # Test de connectivité local
        if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|404\|403"; then
            echo "✅ Le serveur répond correctement"
        else
            echo "⚠️ Le serveur ne répond pas encore (normal si l'app n'est pas déployée)"
        fi
        
        echo ""
        echo "🎉 Nginx configuré et redémarré avec succès !"
        echo "🌐 Votre site sera accessible sur :"
        echo "   👉 http://big-market.fr"
        echo "   👉 http://www.big-market.fr"
        echo "   👉 http://84.234.18.206"
        echo "📊 Statut: $(systemctl is-active nginx)"
        echo "🔍 Logs: tail -f /var/log/nginx/big-market-error.log"
    else
        echo "❌ Nginx n'a pas pu démarrer"
        echo "📝 Vérifiez les logs: journalctl -u nginx"
        exit 1
    fi
else
    echo "❌ Erreur dans la configuration Nginx"
    echo "📝 Détails de l'erreur:"
    nginx -t
    exit 1
fi 