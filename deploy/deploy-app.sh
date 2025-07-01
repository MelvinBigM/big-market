#!/bin/bash

# Script de déploiement de Big Market
# À exécuter sur le VPS Ubuntu 22.04

APP_DIR="/var/www/big-market"
REPO_URL="https://github.com/MelvinBigM/big-market.git"
APP_NAME="big-market"

echo "🚀 Déploiement de Big Market..."

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

# Vérification que Node.js est installé
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js n'est pas installé. Exécutez d'abord install-prerequisites.sh"
    exit 1
fi

# Vérification que PM2 est installé
if ! command -v pm2 >/dev/null 2>&1; then
    echo "❌ PM2 n'est pas installé. Exécutez d'abord install-prerequisites.sh"
    exit 1
fi

# Arrêt de l'application si elle tourne déjà
echo "⏹️ Arrêt de l'application existante..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Sauvegarde de l'ancienne version si elle existe
if [ -d "$APP_DIR" ]; then
    echo "💾 Sauvegarde de l'ancienne version..."
    cp -r $APP_DIR /tmp/big-market-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi

# Aller dans un répertoire sûr pour éviter les problèmes de working directory
cd /tmp

# Nettoyage complet du répertoire
echo "🧹 Nettoyage du répertoire..."
if [ -d "$APP_DIR" ]; then
    rm -rf $APP_DIR
fi

# Clonage du repository
echo "📦 Clonage du repository..."
if ! git clone $REPO_URL $APP_DIR; then
    echo "❌ Erreur lors du clonage du repository"
    exit 1
fi

# Navigation vers le répertoire
cd $APP_DIR

# Vérification de la présence du package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json introuvable dans le repository"
    exit 1
fi

# Installation des dépendances (incluant dev pour le build)
echo "📥 Installation des dépendances..."
if ! npm install; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Build de l'application
echo "🔨 Build de l'application..."
if ! npm run build; then
    echo "❌ Erreur lors du build de l'application"
    exit 1
fi

# Vérification que le dossier dist existe
if [ ! -d "dist" ]; then
    echo "❌ Le dossier 'dist' n'a pas été créé par le build"
    exit 1
fi

# Configuration des permissions
echo "🔧 Configuration des permissions..."
chown -R www-data:www-data $APP_DIR

# Création des logs
mkdir -p /var/log/big-market
chown -R www-data:www-data /var/log/big-market

# Démarrage avec PM2 pour servir les fichiers statiques
echo "🚀 Démarrage de l'application avec PM2..."
if ! pm2 serve dist 3000 --name "$APP_NAME" --spa; then
    echo "❌ Erreur lors du démarrage avec PM2"
    exit 1
fi

# Configuration du démarrage automatique
echo "⚙️ Configuration du démarrage automatique..."
pm2 save
pm2 startup systemd -u root --hp /root

# Vérification du statut
echo "📊 Vérification du statut..."
sleep 3
pm2 status

echo ""
echo "✅ Application déployée avec succès !"
echo "🌐 L'application sera accessible via Nginx sur le port 80"
echo "📊 Utilisez 'pm2 status' pour vérifier l'état de l'application"
echo "📝 Utilisez 'pm2 logs $APP_NAME' pour voir les logs"
echo "🔄 L'application redémarrera automatiquement au reboot du serveur" 