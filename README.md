# 🛡️ Formulaire de Recrutement — Guilde Albion Online

Formulaire de recrutement avec thème MMORPG médiéval/fantastique qui envoie les candidatures directement dans un channel Discord.

## 🚀 Configuration

### Étape 1 : Créer un Webhook Discord

1. Ouvrez votre serveur Discord
2. Allez dans **Paramètres du serveur** (icône ⚙️ à côté du nom du serveur)
3. Cliquez sur **Intégrations** dans le menu de gauche
4. Cliquez sur **Webhooks** puis **Nouveau webhook**
5. Configurez le webhook :
   - **Nom** : Donnez-lui un nom (ex: "Recrutement Guilde")
   - **Canal** : Sélectionnez le channel où vous voulez recevoir les candidatures
   - Cliquez sur **Copier l'URL du webhook**
6. **Important** : Gardez cette URL secrète ! Ne la partagez pas publiquement.

### Étape 2 : Configurer le formulaire

1. Ouvrez le fichier `script.js`
2. Trouvez la ligne en haut du fichier :
   ```javascript
   const DISCORD_WEBHOOK_URL = 'VOTRE_WEBHOOK_URL_ICI';
   ```
3. Remplacez `'VOTRE_WEBHOOK_URL_ICI'` par l'URL de votre webhook (entre guillemets)
   ```javascript
   const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/123456789/abcdefghijklmnop';
   ```

### Étape 3 : Tester

1. Ouvrez `index.html` dans votre navigateur
2. Remplissez le formulaire de test
3. Envoyez-le
4. Vérifiez que le message apparaît bien dans votre channel Discord

## 📋 Fonctionnalités

- ✅ Envoi automatique des candidatures dans Discord
- ✅ Formatage en embed Discord avec toutes les informations
- ✅ Validation des champs requis
- ✅ Design responsive (mobile et desktop)
- ✅ Thème MMORPG médiéval/fantastique
- ✅ Animations et effets visuels

## 🔒 Sécurité

⚠️ **Important** : L'URL du webhook est visible dans le code JavaScript côté client. Pour une meilleure sécurité :

- Utilisez un webhook dédié uniquement pour ce formulaire
- Surveillez les messages reçus
- Si le webhook est compromis, supprimez-le et créez-en un nouveau
- Pour une sécurité maximale, utilisez un backend qui masquera l'URL du webhook

## 🎨 Personnalisation

Vous pouvez personnaliser :
- Le nom de la guilde dans `index.html` (ligne 12)
- Les couleurs dans `style.css`
- Le format du message Discord dans `script.js` (fonction `formatDiscordEmbed`)

## 📝 Format du message Discord

Les candidatures sont envoyées sous forme d'embed Discord avec :
- Titre avec emoji
- Couleur or (#FFD700)
- Sections organisées par catégories
- Timestamp automatique
- Tous les champs du formulaire formatés

## 🐛 Dépannage

**Le formulaire ne s'envoie pas :**
- Vérifiez que l'URL du webhook est correctement configurée
- Vérifiez que le webhook n'a pas été supprimé
- Ouvrez la console du navigateur (F12) pour voir les erreurs

**Le message n'apparaît pas dans Discord :**
- Vérifiez que le webhook pointe vers le bon channel
- Vérifiez que le bot du webhook a les permissions d'envoyer des messages
- Vérifiez que l'URL du webhook est complète et valide

## 📄 Licence

Libre d'utilisation pour votre guilde.

