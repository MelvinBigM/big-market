#!/bin/bash

# Script d'installation des prérequis pour le VPS Ubuntu 22.04
# À exécuter en tant que root ou avec sudo

echo "🚀 Installation des prérequis pour Big Market..."

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

# Mise à jour du système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# Installation des utilitaires de base
echo "🔧 Installation des utilitaires..."
apt install -y curl git wget unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Installation de Node.js 20.x via NodeSource
echo "🟢 Installation de Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installation de Nginx
echo "🌐 Installation de Nginx..."
apt install -y nginx

# Installation de PM2 globalement
echo "⚡ Installation de PM2..."
npm install -g pm2

# Installation d'outils de surveillance
echo "📊 Installation d'outils de surveillance..."
apt install -y htop netstat-openbsd

# Installation de certbot pour SSL (optionnel pour plus tard)
echo "🔒 Installation de Certbot..."
apt install -y certbot python3-certbot-nginx

# Création du répertoire pour l'application
echo "📁 Création des répertoires..."
mkdir -p /var/www/big-market
mkdir -p /var/log/big-market

# Configuration des permissions
chown -R www-data:www-data /var/www/big-market
chown -R www-data:www-data /var/log/big-market

# Configuration du firewall de base
echo "🛡️ Configuration du firewall..."
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# Démarrage et activation des services
echo "🚀 Démarrage des services..."
systemctl enable nginx
systemctl start nginx
systemctl enable ufw

# Affichage des versions installées
echo ""
echo "✅ Installation terminée !"
echo "=========================="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "PM2 version: $(pm2 --version)"
echo "Nginx version: $(nginx -v 2>&1)"
echo "Firewall status: $(ufw status | head -n 1)"
echo ""
echo "🎉 Tous les prérequis sont installés et configurés !" 