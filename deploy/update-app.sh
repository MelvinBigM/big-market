#!/bin/bash

# Script de mise à jour de Big Market
# À exécuter sur le VPS pour mettre à jour l'application

APP_DIR="/var/www/big-market"
APP_NAME="big-market"
LOG_FILE="/var/log/big-market/update.log"

echo "🔄 Mise à jour de Big Market..."

# Vérification des privilèges
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

# Création du répertoire de logs s'il n'existe pas
mkdir -p /var/log/big-market

# Fonction de logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_message "Début de la mise à jour de Big Market"

# Vérification que l'application existe
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Le répertoire de l'application n'existe pas: $APP_DIR"
    log_message "ERREUR: Répertoire application inexistant"
    exit 1
fi

cd "$APP_DIR"

# Vérification de la connectivité
echo "🔍 Vérification de la connectivité..."
if ! ping -c 1 github.com >/dev/null 2>&1; then
    echo "❌ Impossible d'accéder à GitHub"
    log_message "ERREUR: Pas d'accès à GitHub"
    exit 1
fi

# Sauvegarde de l'état actuel
echo "💾 Sauvegarde de l'état actuel..."
BACKUP_DIR="/tmp/big-market-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Sauvegarde des logs PM2
if command -v pm2 >/dev/null 2>&1; then
    pm2 logs $APP_NAME --lines 100 > "$BACKUP_DIR/pm2-logs.log" 2>/dev/null || true
fi

# Sauvegarde du build actuel
if [ -d "dist" ]; then
    cp -r dist "$BACKUP_DIR/dist-backup" 2>/dev/null || true
    log_message "Sauvegarde du build actuel créée"
fi

# Vérification de l'état de git
echo "📋 Vérification de l'état du repository..."
git status --porcelain
if [ $? -ne 0 ]; then
    echo "❌ Erreur avec le repository git"
    log_message "ERREUR: Problème avec le repository git"
    exit 1
fi

# Arrêt de l'application
echo "⏹️ Arrêt de l'application..."
if command -v pm2 >/dev/null 2>&1; then
    pm2 stop $APP_NAME 2>/dev/null || true
    log_message "Application arrêtée"
else
    echo "⚠️ PM2 non trouvé"
    log_message "ATTENTION: PM2 non trouvé"
fi

# Sauvegarde des modifications locales non commitées
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Sauvegarde des modifications locales..."
    git stash push -m "Auto-stash avant mise à jour $(date)"
    log_message "Modifications locales sauvegardées"
fi

# Récupération des dernières modifications
echo "📦 Récupération des mises à jour..."
if git pull origin main; then
    log_message "Mise à jour du code réussie"
else
    echo "❌ Erreur lors de la récupération des mises à jour"
    log_message "ERREUR: Échec de git pull"
    exit 1
fi

# Vérification de package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json introuvable après la mise à jour"
    log_message "ERREUR: package.json manquant"
    exit 1
fi

# Installation des nouvelles dépendances (incluant dev pour le build)
echo "📥 Mise à jour des dépendances..."
if npm install; then
    log_message "Dépendances mises à jour avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    log_message "ERREUR: Échec npm install"
    
    # Tentative de restauration
    echo "🔄 Tentative de restauration..."
    if [ -d "$BACKUP_DIR/dist-backup" ]; then
        rm -rf dist
        cp -r "$BACKUP_DIR/dist-backup" dist
        echo "📦 Build précédent restauré"
    fi
    exit 1
fi

# Nouveau build
echo "🔨 Nouveau build..."
if npm run build; then
    log_message "Build réussi"
else
    echo "❌ Erreur lors du build"
    log_message "ERREUR: Échec du build"
    
    # Tentative de restauration
    echo "🔄 Tentative de restauration du build précédent..."
    if [ -d "$BACKUP_DIR/dist-backup" ]; then
        rm -rf dist
        cp -r "$BACKUP_DIR/dist-backup" dist
        echo "📦 Build précédent restauré"
        log_message "Build précédent restauré"
    fi
    exit 1
fi

# Vérification que le build est valide
if [ ! -d "dist" ] || [ ! "$(ls -A dist 2>/dev/null)" ]; then
    echo "❌ Le build n'a pas généré de fichiers"
    log_message "ERREUR: Build vide"
    exit 1
fi

# Configuration des permissions
echo "🔧 Configuration des permissions..."
chown -R www-data:www-data "$APP_DIR"

# Redémarrage de l'application
echo "🚀 Redémarrage de l'application..."
if command -v pm2 >/dev/null 2>&1; then
    if pm2 restart $APP_NAME; then
        log_message "Application redémarrée avec succès"
    else
        echo "❌ Erreur lors du redémarrage"
        log_message "ERREUR: Échec du redémarrage PM2"
        
        # Tentative de redémarrage manuel
        echo "🔄 Tentative de redémarrage manuel..."
        pm2 delete $APP_NAME 2>/dev/null || true
        if pm2 serve dist 3000 --name "$APP_NAME" --spa; then
            echo "✅ Redémarrage manuel réussi"
            log_message "Redémarrage manuel réussi"
        else
            echo "❌ Échec du redémarrage manuel"
            log_message "ERREUR: Échec du redémarrage manuel"
            exit 1
        fi
    fi
else
    echo "❌ PM2 non disponible"
    log_message "ERREUR: PM2 non disponible"
    exit 1
fi

# Test de l'application
echo "🔍 Test de l'application..."
sleep 3

# Vérification du statut PM2
echo "📊 Statut PM2:"
pm2 status

# Test de connectivité
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404\|403"; then
    echo "✅ L'application répond correctement"
    log_message "Test de connectivité réussi"
else
    echo "⚠️ L'application ne répond pas comme attendu"
    log_message "ATTENTION: Application ne répond pas"
fi

# Redémarrage de Nginx pour sécurité
echo "🌐 Redémarrage de Nginx..."
systemctl reload nginx

echo ""
echo "✅ Mise à jour terminée !"
echo "========================"
log_message "Mise à jour terminée avec succès"

echo "🌐 L'application est accessible sur http://84.234.18.206"
echo "📊 Vérifiez les logs avec: pm2 logs $APP_NAME"
echo "📝 Logs de mise à jour: tail -f $LOG_FILE"
echo "💾 Sauvegarde disponible dans: $BACKUP_DIR"

# Nettoyage des anciennes sauvegardes (garder seulement les 5 dernières)
echo "🧹 Nettoyage des anciennes sauvegardes..."
find /tmp -name "big-market-backup-*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true 