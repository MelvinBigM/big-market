#!/bin/bash

# Script de déploiement de Big Market
# À exécuter sur le VPS Ubuntu 22.04

APP_DIR="/var/www/big-market"
REPO_URL="https://github.com/MelvinBigM/big-market.git"
APP_NAME="big-market"

echo "🚀 Déploiement de Big Market..."

# Arrêt de l'application si elle tourne déjà
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Nettoyage du répertoire
rm -rf $APP_DIR/*

# Clonage du repository
echo "📦 Clonage du repository..."
git clone $REPO_URL $APP_DIR

# Navigation vers le répertoire
cd $APP_DIR

# Installation des dépendances
echo "📥 Installation des dépendances..."
npm install

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Configuration des permissions
chown -R www-data:www-data $APP_DIR

# Démarrage avec PM2 pour servir les fichiers statiques
echo "🚀 Démarrage de l'application avec PM2..."
pm2 serve dist 3000 --name "$APP_NAME" --spa

# Sauvegarde de la configuration PM2
pm2 save
pm2 startup

echo "✅ Application déployée avec succès !"
echo "🌐 L'application sera accessible via Nginx sur le port 80"
echo "📊 Utilisez 'pm2 status' pour vérifier l'état de l'application"
echo "📝 Utilisez 'pm2 logs $APP_NAME' pour voir les logs" 