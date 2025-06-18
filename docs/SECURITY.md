
# Documentation de Sécurité

## Vue d'ensemble de la sécurité

Ce projet implémente une architecture de sécurité multicouche avec les composants suivants :

### 1. Authentification et Autorisation

#### Row Level Security (RLS)
- **Politiques RLS** : Chaque table sensible utilise des politiques RLS pour garantir l'isolation des données
- **Fonction de sécurité** : `get_current_user_role()` pour éviter la récursion dans les politiques
- **Rôles utilisateur** : `admin`, `client`, `nouveau` avec permissions granulaires

#### Authentification
- Utilisation de Supabase Auth pour la gestion des utilisateurs
- Validation des emails et mots de passe côté client et serveur
- Gestion sécurisée des sessions

### 2. Protection contre les Attaques

#### Rate Limiting
- **Connexions** : 5 tentatives par 15 minutes par email
- **Actions admin** : 30 actions par minute par utilisateur
- **Demandes d'accès** : 3 demandes par heure par utilisateur
- **API générale** : 100 appels par minute par utilisateur

#### Validation et Sanitisation
- Validation stricte des entrées utilisateur
- Sanitisation des données avant insertion en base
- Vérification des formats (email, téléphone, code postal)

#### Headers de Sécurité
- **Content Security Policy (CSP)** : Protection contre XSS
- **X-Frame-Options** : Protection contre le clickjacking
- **X-Content-Type-Options** : Prévention du MIME sniffing
- **Referrer-Policy** : Contrôle des informations de référence

### 3. Audit et Monitoring

#### Journal d'Audit
- **Actions administratives** : Toutes les actions sensibles sont loggées
- **Changements de rôles** : Traçabilité complète des modifications
- **Accès aux données** : Enregistrement des consultations sensibles

#### Événements de Sécurité
- **Tentatives de connexion** : Succès et échecs
- **Dépassements de limites** : Rate limiting
- **Activités suspectes** : Détection automatique
- **Erreurs d'authentification** : Traçabilité des problèmes

### 4. Architecture Sécurisée

#### Base de Données
- **SECURITY DEFINER** : Fonctions privilégiées pour les opérations sensibles
- **Politiques granulaires** : Accès basé sur les rôles et contextes
- **Audit automatique** : Triggers pour la journalisation

#### Frontend
- **Validation client** : Première ligne de défense
- **Gestion d'état sécurisée** : Pas d'exposition de données sensibles
- **Navigation protégée** : Vérification des permissions

## Procédures de Sécurité

### En cas d'Incident
1. **Identification** : Consulter les logs de sécurité dans l'interface admin
2. **Isolation** : Désactiver les comptes compromis si nécessaire
3. **Investigation** : Analyser les patterns dans les événements de sécurité
4. **Correction** : Appliquer les mesures correctives appropriées
5. **Documentation** : Enregistrer l'incident et les actions prises

### Maintenance de Sécurité
- **Révision mensuelle** : Analyser les logs d'audit et de sécurité
- **Mise à jour des politiques** : Adapter selon les nouveaux besoins
- **Tests de pénétration** : Vérification périodique des vulnérabilités
- **Formation** : Sensibilisation des utilisateurs administrateurs

### Gestion des Accès
1. **Principe du moindre privilège** : Accorder uniquement les permissions nécessaires
2. **Révision régulière** : Vérifier périodiquement les permissions accordées
3. **Processus d'approbation** : Validation des demandes d'accès par les administrateurs
4. **Traçabilité** : Enregistrement de tous les changements de permissions

## Indicateurs de Sécurité

### Métriques Surveillées
- Nombre de tentatives de connexion échouées
- Fréquence des dépassements de rate limiting
- Volume d'actions administratives par utilisateur
- Patterns d'accès inhabituels

### Alertes Automatiques
- Plus de 10 échecs de connexion par heure
- Dépassement critique du rate limiting
- Tentatives d'accès à des ressources non autorisées
- Modifications de rôles en lot

## Configuration Recommandée

### Variables d'Environnement
```
SUPABASE_URL=https://shfleoigdsgvmdfijaqi.supabase.co
SUPABASE_ANON_KEY=[clé publique]
```

### Politiques de Mot de Passe
- Minimum 6 caractères
- Pas de mots de passe couramment utilisés
- Expiration recommandée : 90 jours

### Sauvegarde et Récupération
- Sauvegardes automatiques quotidiennes
- Tests de restauration mensuels
- Plan de continuité d'activité documenté

## Contact Sécurité

En cas d'incident de sécurité majeur, contacter immédiatement l'équipe technique et documenter l'incident dans le système d'audit.
