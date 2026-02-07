# 🚀 Acquisition OS - Guide Electron Build & Distribution

## Table des matières
- [Développement](#développement)
- [Build de production](#build-de-production)
- [Distribution](#distribution)
- [Gestion des versions](#gestion-des-versions)
- [Troubleshooting](#troubleshooting)

---

## 📦 Développement

### Lancer en mode développement
```bash
npm run electron:dev
```
- Lance Vite dev server sur `http://localhost:5173`
- Ouvre automatiquement l'application Electron
- Hot reload activé

### Structure du projet
```
acquisition-framework-os/
├── electron/
│   └── main.cjs          # Point d'entrée Electron
├── src/                  # Code React/TypeScript
├── dist/                 # Build Vite (généré)
├── release/              # Applications compilées (généré)
└── package.json
```

---

## 🏗️ Build de production

### 1. Build simple (architecture actuelle)
```bash
npm run electron:build
```
Génère : `release/Acquisition OS-1.0.0-arm64.dmg` (Apple Silicon uniquement)

### 2. Build pour Intel Mac
```bash
npm run electron:build -- --x64
```
Génère : `release/Acquisition OS-1.0.0-x64.dmg`

### 3. Build universel (Intel + Apple Silicon)
```bash
npm run electron:build -- --universal
```
Génère : `release/Acquisition OS-1.0.0-universal.dmg`
⚠️ Taille 2x plus grande mais compatible avec tous les Mac

### 4. Nettoyer avant un nouveau build
```bash
# Supprimer les anciens builds
rm -rf release dist

# Rebuild complet
npm run electron:build
```

---

## 📤 Distribution

### Compression pour partage
```bash
# Compresser le DMG
zip -r "Acquisition-OS-v1.0.0.zip" "release/Acquisition OS-1.0.0-arm64.dmg"

# Vérifier la taille
ls -lh "Acquisition-OS-v1.0.0.zip"
```

### Options de partage
1. **WeTransfer** : https://wetransfer.com (gratuit jusqu'à 2GB)
2. **Google Drive** : Partage de lien
3. **Dropbox** : Lien public
4. **GitHub Releases** : Idéal pour versioning
5. **AirDrop** : Mac à Mac en local

### Instructions pour l'utilisateur final

Créez un fichier `INSTALLATION.md` :

```markdown
# Installation Acquisition OS

## Étapes d'installation

1. **Télécharger** le fichier `Acquisition OS-1.0.0-arm64.dmg`

2. **Ouvrir** le fichier DMG (double-clic)

3. **Glisser** l'application dans le dossier Applications

4. **Premier lancement** (Important !)
   - Faire **clic-droit** sur l'application
   - Sélectionner **"Ouvrir"**
   - Cliquer sur **"Ouvrir"** dans l'alerte de sécurité
   
   ⚠️ Si vous double-cliquez directement, macOS bloquera l'application car elle n'est pas signée par Apple.

## Compatibilité

- **macOS 10.12+** (Sierra ou plus récent)
- **Apple Silicon** : M1, M2, M3, M4
- **Intel** : Télécharger la version `-x64.dmg`

## Problèmes courants

### "L'application est endommagée"
```bash
xattr -cr "/Applications/Acquisition OS.app"
```

### L'application ne se lance pas
- Vérifier macOS 10.12+
- Vérifier l'architecture (ARM vs Intel)
```

---

## 🔄 Gestion des versions

### Mise à jour de version

#### 1. Mettre à jour `package.json`
```json
{
  "version": "1.1.0"  // Changer ici
}
```

#### 2. Conventions de versioning (SemVer)
- **1.0.0 → 1.0.1** : Bug fixes (patch)
- **1.0.0 → 1.1.0** : Nouvelles fonctionnalités (minor)
- **1.0.0 → 2.0.0** : Changements majeurs/breaking (major)

#### 3. Workflow complet de mise à jour

```bash
# Étape 1 : Nettoyer
rm -rf release dist node_modules/.vite

# Étape 2 : Mettre à jour la version dans package.json
# Ouvrir package.json et changer "version": "1.1.0"

# Étape 3 : Créer un tag git (optionnel mais recommandé)
git add package.json
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags

# Étape 4 : Build
npm run electron:build

# Étape 5 : Renommer avec la version (optionnel)
mv "release/Acquisition OS-1.1.0-arm64.dmg" "release/Acquisition-OS-v1.1.0-macOS-arm64.dmg"

# Étape 6 : Compresser
zip -r "Acquisition-OS-v1.1.0-macOS-arm64.zip" "release/Acquisition-OS-v1.1.0-macOS-arm64.dmg"

# Étape 7 : Créer un changelog
echo "## v1.1.0 - $(date +%Y-%m-%d)

### ✨ Nouvelles fonctionnalités
- Ajout de...

### 🐛 Corrections de bugs
- Correction de...

### 📦 Installation
Télécharger: Acquisition-OS-v1.1.0-macOS-arm64.zip
" > CHANGELOG-v1.1.0.md
```

### Script automatisé de release

Créez un fichier `scripts/release.sh` :

```bash
#!/bin/bash

# Script de release automatisé
set -e

echo "🚀 Début du processus de release..."

# Vérifier qu'on est sur main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main"
    exit 1
fi

# Demander la nouvelle version
read -p "Nouvelle version (ex: 1.1.0): " VERSION

# Confirmer
read -p "Release version $VERSION ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Nettoyer
echo "🧹 Nettoyage..."
rm -rf release dist

# Mettre à jour package.json
echo "📝 Mise à jour de package.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json

# Commit et tag
echo "📦 Commit et tag..."
git add package.json
git commit -m "chore: release v$VERSION"
git tag "v$VERSION"

# Build
echo "🏗️  Build de l'application..."
npm run electron:build

# Renommer et compresser
echo "📦 Compression..."
DMG_NAME="Acquisition-OS-v$VERSION-macOS-arm64.dmg"
ZIP_NAME="Acquisition-OS-v$VERSION-macOS-arm64.zip"

mv "release/Acquisition OS-$VERSION-arm64.dmg" "release/$DMG_NAME"
cd release && zip -r "$ZIP_NAME" "$DMG_NAME" && cd ..

# Afficher le résultat
echo "✅ Release créée avec succès !"
echo ""
echo "📦 Fichiers générés:"
echo "   - release/$DMG_NAME"
echo "   - release/$ZIP_NAME"
echo ""
echo "🔖 Tag créé: v$VERSION"
echo ""
echo "⚠️  N'oubliez pas de:"
echo "   1. git push origin main --tags"
echo "   2. Créer une GitHub Release"
echo "   3. Uploader les fichiers"
```

Rendre le script exécutable :
```bash
chmod +x scripts/release.sh
```

Utiliser :
```bash
./scripts/release.sh
```

---

## 🔧 Troubleshooting

### Erreur: "JSON does not support comments"
```bash
# Supprimer tous les commentaires // dans package.json
```

### Erreur: "electron/main.cjs is corrupted: size 0"
```bash
# Vérifier que le fichier n'est pas vide
ls -lh electron/main.cjs

# Si vide, le recréer avec le contenu correct
```

### Erreur: "Cannot find module 'electron'"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Build très lent
```bash
# Nettoyer le cache
rm -rf node_modules/.vite
rm -rf dist
npm run electron:build
```

### L'application ne démarre pas après build
```bash
# Vérifier les logs
# Sur Mac, ouvrir Console.app et chercher "Acquisition OS"

# Tester en dev d'abord
npm run electron:dev
```

### "default Electron icon is used"
Pour ajouter une icône personnalisée :

1. Créer une icône `.icns` (512x512px minimum)
2. La placer dans `public/icon.icns`
3. Mettre à jour `package.json` :
```json
{
  "build": {
    "mac": {
      "icon": "public/icon.icns"
    }
  }
}
```

### Créer un fichier .icns depuis PNG
```bash
# Installer imagemagick
brew install imagemagick

# Créer l'icône
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

iconutil -c icns icon.iconset
mv icon.icns public/
```

---

## 🔐 Code Signing (Distribution professionnelle)

Pour éviter l'avertissement de sécurité macOS :

### 1. Inscription Apple Developer
- Compte : https://developer.apple.com
- Coût : 99$/an

### 2. Créer un certificat
1. Ouvrir Xcode
2. Preferences → Accounts → Manage Certificates
3. Créer "Developer ID Application"

### 3. Configurer electron-builder

Ajouter à `package.json` :
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Votre Nom (TEAMID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "afterSign": "scripts/notarize.js"
  }
}
```

### 4. Notarization (requis pour macOS 10.15+)

Créer `scripts/notarize.js` :
```javascript
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.acquisition.framework',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
```

Installer :
```bash
npm install --save-dev @electron/notarize
```

Build signé :
```bash
APPLE_ID="your@email.com" \
APPLE_ID_PASSWORD="app-specific-password" \
APPLE_TEAM_ID="TEAMID" \
npm run electron:build
```

---

## 📊 Checklist de release

- [ ] Tests en mode dev (`npm run electron:dev`)
- [ ] Mise à jour de la version dans `package.json`
- [ ] Mise à jour du `CHANGELOG.md`
- [ ] Commit des changements
- [ ] Création du tag git (`git tag v1.x.x`)
- [ ] Build de production (`npm run electron:build`)
- [ ] Test du DMG sur un Mac propre
- [ ] Compression du DMG
- [ ] Upload sur plateforme de distribution
- [ ] Push du tag (`git push --tags`)
- [ ] Création GitHub Release (si applicable)
- [ ] Notification aux utilisateurs

---

## 🎯 Commandes rapides

```bash
# Dev
npm run electron:dev

# Build ARM (Apple Silicon)
npm run electron:build

# Build Intel
npm run electron:build -- --x64

# Build universel
npm run electron:build -- --universal

# Clean + Build
rm -rf release dist && npm run electron:build

# Compress
zip -r "app.zip" "release/Acquisition OS-1.0.0-arm64.dmg"

# Test DMG
open "release/Acquisition OS-1.0.0-arm64.dmg"
```

---

## 📚 Ressources

- **Electron Builder** : https://www.electron.build/
- **Electron Docs** : https://www.electronjs.org/docs
- **Code Signing Guide** : https://www.electron.build/code-signing
- **Notarization Guide** : https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

---

**Bon build ! 🚀**
