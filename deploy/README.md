# Guide de Déploiement - Big Market

Ce guide explique comment déployer Big Market sur un VPS Ubuntu 22.04 LTS avec une configuration complète et sécurisée.

## 🔧 Prérequis

- **VPS Ubuntu 22.04 LTS** avec au moins 1GB RAM et 2GB d'espace disque
- **Accès root ou sudo** 
- **Connexion SSH** (PuTTY)
- **IP du VPS** : `84.234.18.206`
- **Domaine** : `big-market.fr`
- **Connexion Internet** stable

## 🚀 Déploiement rapide (Recommandé)

### Option 1: Déploiement automatique en une commande

```bash
# Commande unique pour déployer automatiquement
curl -fsSL https://raw.githubusercontent.com/MelvinBigM/big-market/main/deploy/quick-start.sh | sudo bash
```

Cette commande va :
- ✅ Télécharger le code source
- ✅ Installer tous les prérequis
- ✅ Configurer Nginx
- ✅ Déployer l'application
- ✅ Configurer PM2 pour le redémarrage automatique

## 📋 Déploiement manuel (Contrôle étape par étape)

### 1. Vérification système (optionnel)

```bash
# Télécharger et exécuter la vérification système
curl -fsSL https://raw.githubusercontent.com/MelvinBigM/big-market/main/deploy/check-system.sh | sudo bash
```

### 2. Clonage du repository

```bash
# Clonage du repository
sudo git clone https://github.com/MelvinBigM/big-market.git /var/www/big-market

# Navigation vers le dossier de déploiement
cd /var/www/big-market/deploy

# Rendre les scripts exécutables
sudo chmod +x *.sh
```

### 3. Déploiement complet

```bash
# Déploiement en 4 étapes automatisées
sudo ./full-deploy.sh
```

Ou étape par étape :

```bash
# Étape 1: Installation des prérequis
sudo ./install-prerequisites.sh

# Étape 2: Configuration Nginx
sudo ./setup-nginx.sh

# Étape 3: Déploiement de l'application
sudo ./deploy-app.sh
```

## 🌐 Accès au site

Après le déploiement, votre site sera accessible sur :
- **URL principale** : http://big-market.fr
- **Avec www** : http://www.big-market.fr
- **IP directe** : http://84.234.18.206
- **HTTPS** : https://big-market.fr (après configuration SSL)
- **Ports** : 80 (HTTP), 443 (HTTPS)

## 🛠️ Scripts disponibles

| Script | Description |
|--------|-------------|
| `quick-start.sh` | Déploiement automatique complet |
| `full-deploy.sh` | Déploiement en 4 étapes avec logs |
| `install-prerequisites.sh` | Installation Node.js, Nginx, PM2 |
| `setup-nginx.sh` | Configuration du serveur web |
| `deploy-app.sh` | Build et déploiement de l'application |
| `update-app.sh` | Mise à jour de l'application |
| `setup-ssl.sh` | Configuration SSL/HTTPS automatique |
| `check-system.sh` | Vérification des prérequis système |

## 📊 Surveillance et commandes utiles

### Statut des services

```bash
# Statut de l'application
pm2 status

# Statut détaillé avec métriques
pm2 monit

# Statut de Nginx
sudo systemctl status nginx

# Statut du firewall
sudo ufw status
```

### Logs et débuggage

```bash
# Logs de l'application en temps réel
pm2 logs big-market

# Logs Nginx
tail -f /var/log/nginx/big-market-error.log
tail -f /var/log/nginx/big-market-access.log

# Logs de déploiement
tail -f /var/log/big-market/deploy.log

# Logs système
journalctl -u nginx -f
```

### Gestion de l'application

```bash
# Redémarrer l'application
pm2 restart big-market

# Arrêter l'application
pm2 stop big-market

# Démarrer l'application
pm2 start big-market

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 🔄 Mise à jour de l'application

### Mise à jour automatique

```bash
cd /var/www/big-market/deploy
sudo ./update-app.sh
```

### Mise à jour manuelle

```bash
cd /var/www/big-market
sudo git pull origin main
sudo npm install --production
sudo npm run build
sudo pm2 restart big-market
sudo systemctl reload nginx
```

## ⚙️ Configuration technique

### Architecture déployée

- **Frontend** : React + TypeScript + Vite
- **Serveur web** : Nginx (proxy reverse)
- **Gestionnaire de processus** : PM2
- **Base de données** : Supabase (cloud)
- **Runtime** : Node.js 20.x

### Configuration Supabase

L'application utilise Supabase avec la configuration suivante :
- **URL** : `https://shfleoigdsgvmdfijaqi.supabase.co`
- **Clé publique** : Intégrée dans le code
- **Connexion** : Directe depuis le navigateur (aucune config serveur requise)

### Sécurité mise en place

- **Firewall UFW** : Ports 22, 80, 443 ouverts
- **Headers de sécurité** : X-Frame-Options, CSP, HSTS
- **Compression** : Gzip activé pour tous les assets
- **Cache** : Optimisé pour les performances
- **Permissions** : www-data pour les fichiers web

## 🔒 Configuration SSL/HTTPS

### Configuration automatique

Le domaine `big-market.fr` est déjà configuré ! Pour activer HTTPS :

```bash
# Navigation vers les scripts
cd /var/www/big-market/deploy

# Configuration SSL automatique
sudo chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

### Configuration manuelle (si nécessaire)

```bash
# Installation SSL pour big-market.fr
sudo certbot --nginx -d big-market.fr -d www.big-market.fr

# Test du renouvellement automatique
sudo certbot renew --dry-run
```

## 🔧 Dépannage

### Problèmes fréquents

#### L'application ne démarre pas
```bash
# Vérifier les logs PM2
pm2 logs big-market

# Redémarrer PM2
pm2 restart big-market

# Vérifier le build
ls -la /var/www/big-market/dist/
```

#### Nginx ne répond pas
```bash
# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier les logs
tail -f /var/log/nginx/big-market-error.log
```

#### Problème de permissions
```bash
# Remettre les bonnes permissions
sudo chown -R www-data:www-data /var/www/big-market
sudo chmod -R 755 /var/www/big-market
```

#### Problème de connectivité
```bash
# Vérifier les ports ouverts
sudo netstat -tlnp | grep -E ':(80|3000)'

# Vérifier le firewall
sudo ufw status

# Test local
curl -I http://localhost
```

### Commandes de diagnostic

```bash
# Diagnostic complet
sudo ./check-system.sh

# Test de connectivité
curl -I http://84.234.18.206

# Vérification des processus
ps aux | grep -E '(nginx|node|pm2)'

# Espace disque
df -h

# Mémoire
free -h
```

## 📈 Performance et monitoring

### Monitoring PM2

```bash
# Interface de monitoring
pm2 monit

# Statistiques
pm2 show big-market

# Redémarrage automatique en cas de crash
pm2 startup
```

### Logs de performance

Les logs sont automatiquement créés dans :
- `/var/log/nginx/big-market-access.log` - Accès web
- `/var/log/nginx/big-market-error.log` - Erreurs web
- `/var/log/big-market/deploy.log` - Déploiements
- `/var/log/big-market/update.log` - Mises à jour

## 📞 Support

En cas de problème persistant :

1. **Consultez les logs** avec les commandes ci-dessus
2. **Vérifiez la connectivité** réseau et GitHub
3. **Redémarrez les services** un par un
4. **Utilisez le script de vérification** : `sudo ./check-system.sh`

### Réinstallation complète

Si nécessaire, pour repartir à zéro :

```bash
# Arrêt des services
sudo pm2 delete big-market
sudo systemctl stop nginx

# Suppression complète
sudo rm -rf /var/www/big-market
sudo rm -f /etc/nginx/sites-enabled/big-market
sudo rm -f /etc/nginx/sites-available/big-market

# Redéploiement
curl -fsSL https://raw.githubusercontent.com/MelvinBigM/big-market/main/deploy/quick-start.sh | sudo bash
```

---

**🎉 Votre site Big Market est maintenant déployé et accessible sur http://big-market.fr !**

## 🚀 Étapes pour finaliser

### 1. Déployer votre site (si pas encore fait)
```bash
curl -fsSL https://raw.githubusercontent.com/MelvinBigM/big-market/main/deploy/quick-start.sh | sudo bash
```

### 2. Configurer HTTPS
```bash
cd /var/www/big-market/deploy
sudo chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

### 3. Votre site sera accessible sur
- **HTTP** : http://big-market.fr
- **HTTPS** : https://big-market.fr (après SSL)
- **Avec www** : http://www.big-market.fr et https://www.big-market.fr 