#!/bin/bash

# Script de mise à jour de Big Market
# À exécuter sur le VPS pour mettre à jour l'application

APP_DIR="/var/www/big-market"
APP_NAME="big-market"

echo "🔄 Mise à jour de Big Market..."

cd $APP_DIR

# Sauvegarde de l'état actuel
echo "💾 Sauvegarde des logs PM2..."
pm2 logs $APP_NAME --lines 100 > /tmp/big-market-logs-backup.log

# Arrêt de l'application
echo "⏹️ Arrêt de l'application..."
pm2 stop $APP_NAME

# Récupération des dernières modifications
echo "📦 Récupération des mises à jour..."
git pull origin main

# Installation des nouvelles dépendances
echo "📥 Mise à jour des dépendances..."
npm install

# Nouveau build
echo "🔨 Nouveau build..."
npm run build

# Redémarrage de l'application
echo "🚀 Redémarrage de l'application..."
pm2 restart $APP_NAME

# Vérification du statut
pm2 status

echo "✅ Mise à jour terminée !"
echo "🌐 L'application est accessible sur http://84.234.18.206"
echo "📊 Vérifiez les logs avec: pm2 logs $APP_NAME" 