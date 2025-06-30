#!/bin/bash

# Script de déploiement complet pour Big Market
# Exécute toutes les étapes de déploiement en une seule commande

echo "🚀 DÉPLOIEMENT COMPLET DE BIG MARKET"
echo "======================================"
echo ""

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    echo "Usage: sudo ./full-deploy.sh"
    exit 1
fi

# Répertoire de travail
SCRIPT_DIR="/var/www/big-market/deploy"

# Étape 1: Installation des prérequis
echo "📋 ÉTAPE 1/4: Installation des prérequis..."
echo "==========================================="
if [ -f "$SCRIPT_DIR/install-prerequisites.sh" ]; then
    bash $SCRIPT_DIR/install-prerequisites.sh
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des prérequis"
        exit 1
    fi
else
    echo "❌ Script d'installation des prérequis introuvable"
    exit 1
fi

echo ""
echo "⏳ Pause de 5 secondes pour laisser les services se stabiliser..."
sleep 5

# Étape 2: Déploiement de l'application
echo "📦 ÉTAPE 2/4: Déploiement de l'application..."
echo "============================================="
if [ -f "$SCRIPT_DIR/deploy-app.sh" ]; then
    bash $SCRIPT_DIR/deploy-app.sh
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors du déploiement de l'application"
        exit 1
    fi
else
    echo "❌ Script de déploiement d'application introuvable"
    exit 1
fi

echo ""
echo "⏳ Pause de 3 secondes..."
sleep 3

# Étape 3: Configuration de Nginx
echo "🌐 ÉTAPE 3/4: Configuration de Nginx..."
echo "======================================"
if [ -f "$SCRIPT_DIR/setup-nginx.sh" ]; then
    bash $SCRIPT_DIR/setup-nginx.sh
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de la configuration de Nginx"
        exit 1
    fi
else
    echo "❌ Script de configuration Nginx introuvable"
    exit 1
fi

echo ""

# Étape 4: Vérifications finales
echo "✅ ÉTAPE 4/4: Vérifications finales..."
echo "====================================="

# Vérification du statut PM2
echo "📊 Statut PM2:"
pm2 status

echo ""

# Vérification du statut Nginx
echo "🌐 Statut Nginx:"
systemctl status nginx --no-pager -l

echo ""

# Vérification des ports
echo "🔌 Ports en écoute:"
netstat -tlnp | grep -E ':(80|3000)'

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "===================================="
echo ""
echo "🌐 Votre site est maintenant accessible sur:"
echo "   👉 http://84.234.18.206"
echo ""
echo "📊 Commandes de surveillance:"
echo "   • Statut de l'app:    pm2 status"
echo "   • Logs de l'app:      pm2 logs big-market"
echo "   • Statut Nginx:       systemctl status nginx"
echo "   • Logs Nginx:         tail -f /var/log/nginx/big-market-error.log"
echo ""
echo "🔄 Pour mettre à jour l'application:"
echo "   cd /var/www/big-market/deploy && sudo ./update-app.sh"
echo ""
echo "📚 Consultez deploy/README.md pour plus d'informations" 