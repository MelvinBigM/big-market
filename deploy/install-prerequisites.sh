#!/bin/bash

# Script d'installation des prérequis pour le VPS Ubuntu 22.04
# À exécuter en tant que root ou avec sudo

echo "🚀 Installation des prérequis pour Big Market..."

# Mise à jour du système
apt update && apt upgrade -y

# Installation de curl et git
apt install -y curl git

# Installation de Node.js 20.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installation de Nginx
apt install -y nginx

# Installation de PM2 globalement
npm install -g pm2

# Installation de certbot pour SSL (optionnel pour plus tard)
apt install -y certbot python3-certbot-nginx

# Création du répertoire pour l'application
mkdir -p /var/www/big-market

# Configuration des permissions
chown -R www-data:www-data /var/www/big-market

# Affichage des versions installées
echo "✅ Installation terminée !"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "PM2 version: $(pm2 --version)"
echo "Nginx version: $(nginx -v)"

# Démarrage et activation des services
systemctl enable nginx
systemctl start nginx

echo "🎉 Tous les prérequis sont installés et configurés !" 