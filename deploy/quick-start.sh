#!/bin/bash

# Script de démarrage rapide pour Big Market
# Ce script peut être exécuté directement sur un VPS Ubuntu 22.04 vierge

echo "🚀 DÉMARRAGE RAPIDE - Big Market"
echo "================================"
echo ""
echo "Déploiement automatique sur VPS Ubuntu 22.04 LTS"
echo "Domaine: big-market.fr | IP: 84.234.18.206"
echo ""

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root"
    echo "💡 Exécutez: sudo $0"
    exit 1
fi

# Vérification de la connectivité
echo "🔍 Vérification de la connectivité..."
if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo "❌ Pas de connexion Internet"
    echo "Vérifiez votre connexion réseau et réessayez"
    exit 1
fi

if ! ping -c 1 github.com >/dev/null 2>&1; then
    echo "❌ Impossible d'accéder à GitHub"
    echo "Vérifiez votre connexion et les paramètres DNS"
    exit 1
fi

echo "✅ Connexion Internet OK"
echo ""

# Installation de git si nécessaire
if ! command -v git >/dev/null 2>&1; then
    echo "📦 Installation de Git..."
    apt update -qq
    apt install -y git
fi

# Clonage du repository
echo "📥 Téléchargement du code source..."
if [ -d "/var/www/big-market" ]; then
    echo "🗑️ Suppression de l'installation précédente..."
    rm -rf /var/www/big-market
fi

git clone https://github.com/MelvinBigM/big-market.git /var/www/big-market

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du clonage du repository"
    exit 1
fi

echo "✅ Code source téléchargé"
echo ""

# Navigation vers le dossier de déploiement
cd /var/www/big-market/deploy

# Rendre les scripts exécutables
echo "🔧 Configuration des permissions..."
chmod +x *.sh

# Lancement du déploiement complet
echo "🚀 Lancement du déploiement complet..."
echo "======================================"
echo ""

./full-deploy.sh

# Vérification finale
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo "======================="
    echo ""
    echo "🌐 Votre site Big Market est maintenant en ligne !"
    echo "   👉 http://big-market.fr"
    echo "   👉 http://www.big-market.fr"
    echo "   👉 http://84.234.18.206"
    echo ""
    echo "📱 Testez votre site:"
    echo "   • Ouvrez votre navigateur"
    echo "   • Allez sur http://big-market.fr"
    echo "   • Ou sur http://www.big-market.fr"
    echo "   • Ou sur http://84.234.18.206"
    echo "   • Vérifiez que le site se charge correctement"
    echo ""
    echo "🛠️ Commandes utiles:"
    echo "   • pm2 status              - Statut de l'application"
    echo "   • pm2 logs big-market     - Logs de l'application"
    echo "   • systemctl status nginx  - Statut du serveur web"
    echo ""
    echo "🔄 Pour mettre à jour plus tard:"
    echo "   cd /var/www/big-market/deploy && sudo ./update-app.sh"
else
    echo ""
    echo "❌ ÉCHEC DU DÉPLOIEMENT"
    echo "======================"
    echo ""
    echo "Vérifiez les logs ci-dessus pour identifier le problème"
    echo "Vous pouvez réexécuter ce script après avoir corrigé les erreurs"
fi 