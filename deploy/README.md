# Guide de Déploiement - Big Market

Ce guide explique comment déployer Big Market sur un VPS Ubuntu 22.04 LTS.

## Prérequis

- VPS Ubuntu 22.04 LTS
- Accès root ou sudo
- Connexion SSH (PuTTY)
- IP du VPS : `84.234.18.206`

## Étapes de déploiement

### 1. Connexion au VPS

Connectez-vous à votre VPS via PuTTY avec l'IP `84.234.18.206`.

### 2. Installation des prérequis

```bash
# Clonage du repository
git clone https://github.com/MelvinBigM/big-market.git /var/www/big-market

# Navigation vers le dossier de déploiement
cd /var/www/big-market/deploy

# Rendre les scripts exécutables
chmod +x *.sh

# Installation des prérequis (Node.js, Nginx, PM2)
sudo ./install-prerequisites.sh
```

### 3. Déploiement de l'application

```bash
# Déploiement complet de l'application
sudo ./deploy-app.sh
```

### 4. Configuration de Nginx

```bash
# Configuration du serveur web
sudo ./setup-nginx.sh
```

## Vérification du déploiement

Après le déploiement, votre site sera accessible sur :
- **URL** : http://84.234.18.206
- **Port** : 80 (HTTP standard)

### Commandes utiles

```bash
# Vérifier le statut de l'application
pm2 status

# Voir les logs de l'application
pm2 logs big-market

# Redémarrer l'application
pm2 restart big-market

# Vérifier le statut de Nginx
sudo systemctl status nginx

# Redémarrer Nginx
sudo systemctl restart nginx
```

## Mise à jour de l'application

Pour mettre à jour l'application avec les dernières modifications :

```bash
cd /var/www/big-market/deploy
sudo ./update-app.sh
```

## Configuration Supabase

L'application utilise Supabase avec la configuration suivante :
- **URL** : https://shfleoigdsgvmdfijaqi.supabase.co
- **Clé publique** : Configurée dans le code

Aucune configuration supplémentaire n'est nécessaire côté serveur pour Supabase.

## Surveillance et maintenance

### Logs

- **Application** : `pm2 logs big-market`
- **Nginx Access** : `/var/log/nginx/big-market-access.log`
- **Nginx Error** : `/var/log/nginx/big-market-error.log`

### Sauvegarde automatique PM2

PM2 est configuré pour redémarrer automatiquement l'application en cas de redémarrage du serveur.

## Sécurité

- Nginx est configuré avec des en-têtes de sécurité
- Compression gzip activée
- Cache optimisé pour les assets statiques

## Ajout d'un nom de domaine (optionnel)

Pour configurer un nom de domaine plus tard :

1. Pointez votre domaine vers l'IP `84.234.18.206`
2. Modifiez `/etc/nginx/sites-available/big-market`
3. Remplacez `server_name 84.234.18.206;` par `server_name votre-domaine.com;`
4. Redémarrez Nginx : `sudo systemctl reload nginx`
5. Configurez SSL avec Certbot : `sudo certbot --nginx -d votre-domaine.com`

## Support

En cas de problème, vérifiez :
1. Les logs PM2 : `pm2 logs big-market`
2. Les logs Nginx : `tail -f /var/log/nginx/big-market-error.log`
3. Le statut des services : `pm2 status` et `sudo systemctl status nginx` 