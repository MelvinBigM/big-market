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

# Variables
SCRIPT_DIR="/var/www/big-market/deploy"
APP_DIR="/var/www/big-market"
LOG_FILE="/var/log/big-market/deploy.log"

# Création du répertoire de logs
mkdir -p /var/log/big-market

# Fonction de logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_message "Début du déploiement complet de Big Market"

# Vérification de la connectivité
echo "🔍 Vérification de la connectivité..."
if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo "❌ Pas de connexion Internet"
    exit 1
fi

if ! ping -c 1 github.com >/dev/null 2>&1; then
    echo "❌ Impossible d'accéder à GitHub"
    exit 1
fi

echo "✅ Connectivité Internet OK"
log_message "Connectivité vérifiée avec succès"

# Étape 1: Installation des prérequis
echo ""
echo "📋 ÉTAPE 1/4: Installation des prérequis..."
echo "==========================================="
log_message "Début installation des prérequis"

if [ -f "$SCRIPT_DIR/install-prerequisites.sh" ]; then
    if bash "$SCRIPT_DIR/install-prerequisites.sh"; then
        log_message "Installation des prérequis réussie"
    else
        log_message "ERREUR: Installation des prérequis échouée"
        echo "❌ Erreur lors de l'installation des prérequis"
        exit 1
    fi
else
    echo "❌ Script d'installation des prérequis introuvable"
    log_message "ERREUR: Script install-prerequisites.sh introuvable"
    exit 1
fi

echo ""
echo "⏳ Pause de 5 secondes pour laisser les services se stabiliser..."
sleep 5

# Étape 2: Configuration de Nginx (avant le déploiement de l'app)
echo ""
echo "🌐 ÉTAPE 2/4: Configuration de Nginx..."
echo "======================================"
log_message "Début configuration Nginx"

if [ -f "$SCRIPT_DIR/setup-nginx.sh" ]; then
    if bash "$SCRIPT_DIR/setup-nginx.sh"; then
        log_message "Configuration Nginx réussie"
    else
        log_message "ERREUR: Configuration Nginx échouée"
        echo "❌ Erreur lors de la configuration de Nginx"
        exit 1
    fi
else
    echo "❌ Script de configuration Nginx introuvable"
    log_message "ERREUR: Script setup-nginx.sh introuvable"
    exit 1
fi

echo ""
echo "⏳ Pause de 3 secondes..."
sleep 3

# Étape 3: Déploiement de l'application
echo ""
echo "📦 ÉTAPE 3/4: Déploiement de l'application..."
echo "============================================="
log_message "Début déploiement de l'application"

# Sauvegarder le répertoire de travail actuel
CURRENT_DIR=$(pwd)

if [ -f "$SCRIPT_DIR/deploy-app.sh" ]; then
    if bash "$SCRIPT_DIR/deploy-app.sh"; then
        log_message "Déploiement de l'application réussi"
    else
        log_message "ERREUR: Déploiement de l'application échoué"
        echo "❌ Erreur lors du déploiement de l'application"
        exit 1
    fi
else
    echo "❌ Script de déploiement d'application introuvable"
    log_message "ERREUR: Script deploy-app.sh introuvable"
    exit 1
fi

# Retourner dans le répertoire des scripts pour la suite
cd "$CURRENT_DIR" 2>/dev/null || cd /var/www/big-market/deploy

echo ""
echo "⏳ Pause de 5 secondes pour stabilisation..."
sleep 5

# Étape 4: Vérifications finales
echo ""
echo "✅ ÉTAPE 4/4: Vérifications finales..."
echo "====================================="
log_message "Début des vérifications finales"

# Vérification du statut PM2
echo "📊 Statut PM2:"
pm2 status
pm2_status=$?

echo ""

# Vérification du statut Nginx
echo "🌐 Statut Nginx:"
systemctl status nginx --no-pager -l
nginx_status=$?

echo ""

# Vérification des ports
echo "🔌 Ports en écoute:"
netstat -tlnp | grep -E ':(80|3000)' || echo "Aucun port détecté (peut être normal)"

echo ""

# Test de connectivité local
echo "🔍 Test de connectivité local..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|404\|403"; then
    echo "✅ Le serveur répond localement"
    log_message "Test de connectivité local réussi"
else
    echo "⚠️ Le serveur ne répond pas localement"
    log_message "ATTENTION: Le serveur ne répond pas localement"
fi

# Vérification des fichiers de l'application
if [ -d "$APP_DIR/dist" ] && [ "$(ls -A $APP_DIR/dist 2>/dev/null)" ]; then
    echo "✅ Application buildée correctement"
    log_message "Application buildée et présente"
else
    echo "❌ Problème avec le build de l'application"
    log_message "ERREUR: Problème avec le build de l'application"
fi

echo ""

# Résultat final
if [ $pm2_status -eq 0 ] && [ $nginx_status -eq 0 ]; then
    echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
    echo "===================================="
    log_message "Déploiement complet réussi"
    
    echo ""
    echo "🌐 Votre site est maintenant accessible sur:"
    echo "   👉 http://84.234.18.206"
    echo ""
    echo "📊 Commandes de surveillance:"
    echo "   • Statut de l'app:    pm2 status"
    echo "   • Logs de l'app:      pm2 logs big-market"
    echo "   • Statut Nginx:       systemctl status nginx"
    echo "   • Logs Nginx:         tail -f /var/log/nginx/big-market-error.log"
    echo "   • Logs déploiement:   tail -f $LOG_FILE"
    echo ""
    echo "🔄 Pour mettre à jour l'application:"
    echo "   cd /var/www/big-market/deploy && sudo ./update-app.sh"
    echo ""
    echo "📚 Consultez deploy/README.md pour plus d'informations"
    
    # Test final externe
    echo ""
    echo "🌍 Test d'accès externe..."
    echo "Ouvrez votre navigateur et allez sur http://84.234.18.206"
    echo "Le site devrait maintenant être accessible !"
    
else
    echo "❌ DÉPLOIEMENT PARTIELLEMENT ÉCHOUÉ"
    echo "==================================="
    log_message "ERREUR: Déploiement partiellement échoué"
    
    echo ""
    echo "📝 Vérifiez les logs pour identifier les problèmes:"
    echo "   • PM2: pm2 logs big-market"
    echo "   • Nginx: tail -f /var/log/nginx/big-market-error.log"
    echo "   • Système: journalctl -u nginx"
    echo "   • Déploiement: tail -f $LOG_FILE"
    
    exit 1
fi 