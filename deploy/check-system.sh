#!/bin/bash

# Script de vérification système pour Big Market
# Vérifie si le VPS est prêt pour le déploiement

echo "🔍 VÉRIFICATION SYSTÈME - Big Market"
echo "===================================="
echo ""

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Fonction pour afficher le statut
print_status() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
    else
        echo "❌ $2"
    fi
}

# Vérification de l'OS
echo "📋 Informations système:"
echo "========================"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Uptime: $(uptime -p)"
echo ""

# Vérification des privilèges
echo "🔐 Privilèges:"
echo "=============="
if [ "$EUID" -eq 0 ]; then
    print_status 0 "Exécution en tant que root/sudo"
else
    print_status 1 "Pas d'accès root (requis pour l'installation)"
fi
echo ""

# Vérification de l'espace disque
echo "💾 Espace disque:"
echo "================"
df -h / | tail -n 1 | while read -r filesystem size used avail percent mount; do
    echo "Disponible: $avail sur $size (utilisé: $percent)"
    # Convertir en nombre pour comparaison
    avail_gb=$(echo $avail | sed 's/G.*//' | sed 's/M.*/0/')
    if [ "$avail_gb" -ge 2 ]; then
        print_status 0 "Espace disque suffisant (minimum 2GB requis)"
    else
        print_status 1 "Espace disque insuffisant (minimum 2GB requis)"
    fi
done
echo ""

# Vérification de la RAM
echo "🧠 Mémoire RAM:"
echo "==============="
total_ram=$(free -h | awk '/^Mem:/ {print $2}')
echo "RAM totale: $total_ram"
free_ram=$(free -m | awk '/^Mem:/ {print $7}')
if [ "$free_ram" -ge 512 ]; then
    print_status 0 "RAM disponible suffisante (minimum 512MB requis)"
else
    print_status 1 "RAM disponible insuffisante (minimum 512MB requis)"
fi
echo ""

# Vérification de la connectivité réseau
echo "🌐 Connectivité réseau:"
echo "======================"
if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    print_status 0 "Connexion Internet disponible"
else
    print_status 1 "Pas de connexion Internet"
fi

if ping -c 1 github.com >/dev/null 2>&1; then
    print_status 0 "Accès à GitHub disponible"
else
    print_status 1 "Pas d'accès à GitHub"
fi

if ping -c 1 registry.npmjs.org >/dev/null 2>&1; then
    print_status 0 "Accès au registry npm disponible"
else
    print_status 1 "Pas d'accès au registry npm"
fi
echo ""

# Vérification des ports
echo "🔌 Ports:"
echo "========="
if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    print_status 1 "Port 80 occupé (nécessaire pour Nginx)"
else
    print_status 0 "Port 80 disponible"
fi

if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    print_status 1 "Port 3000 occupé (utilisé par l'application)"
else
    print_status 0 "Port 3000 disponible"
fi
echo ""

# Vérification des logiciels installés
echo "📦 Logiciels requis:"
echo "==================="

# Git
if command_exists git; then
    git_version=$(git --version | cut -d' ' -f3)
    print_status 0 "Git installé (version $git_version)"
else
    print_status 1 "Git non installé"
fi

# Curl
if command_exists curl; then
    print_status 0 "Curl installé"
else
    print_status 1 "Curl non installé"
fi

# Node.js
if command_exists node; then
    node_version=$(node --version)
    print_status 0 "Node.js installé ($node_version)"
else
    print_status 1 "Node.js non installé"
fi

# npm
if command_exists npm; then
    npm_version=$(npm --version)
    print_status 0 "npm installé (version $npm_version)"
else
    print_status 1 "npm non installé"
fi

# PM2
if command_exists pm2; then
    pm2_version=$(pm2 --version)
    print_status 0 "PM2 installé (version $pm2_version)"
else
    print_status 1 "PM2 non installé"
fi

# Nginx
if command_exists nginx; then
    nginx_version=$(nginx -v 2>&1 | cut -d'/' -f2)
    print_status 0 "Nginx installé (version $nginx_version)"
    
    # Vérification du statut Nginx
    if systemctl is-active --quiet nginx; then
        print_status 0 "Nginx en cours d'exécution"
    else
        print_status 1 "Nginx arrêté"
    fi
else
    print_status 1 "Nginx non installé"
fi

echo ""

# Résumé
echo "📊 RÉSUMÉ:"
echo "=========="
echo ""

# Vérifier si le système est prêt
ready=true

# Vérifications critiques
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Exécutez ce script avec sudo pour l'installation"
    ready=false
fi

if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo "⚠️  Connexion Internet requise"
    ready=false
fi

if [ "$ready" = true ]; then
    echo "🎉 Le système est prêt pour le déploiement !"
    echo ""
    echo "🚀 Pour déployer Big Market, exécutez:"
    echo "   git clone https://github.com/MelvinBigM/big-market.git /var/www/big-market"
    echo "   cd /var/www/big-market/deploy"
    echo "   chmod +x *.sh"
    echo "   sudo ./full-deploy.sh"
else
    echo "❌ Le système nécessite une configuration supplémentaire"
    echo ""
    echo "📋 Actions recommandées:"
    if [ "$EUID" -ne 0 ]; then
        echo "   • Exécuter avec sudo"
    fi
    if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        echo "   • Vérifier la connexion Internet"
    fi
    echo "   • Installer les dépendances manquantes"
fi 