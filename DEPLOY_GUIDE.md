# 🚀 Como Configurar Atualizações Automáticas

## Passo 1: Criar Repositório no GitHub

```bash
cd /home/codespace/app
git init
git add .
git commit -m "Initial commit - Agenda app com live updates"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## Passo 2: Ativar GitHub Pages

1. Vá em: **Settings** > **Pages**
2. Source: **Deploy from branch**
3. Branch: **main** / Folder: **/ (root)**
4. Salve

## Passo 3: Atualizar URL no Código

Em `src/services/updateService.ts`, linha 13:
```typescript
const UPDATE_CHECK_URL = 'https://SEU_USUARIO.github.io/SEU_REPO/version.json';
```

## Passo 4: Workflow para Deploy Automático

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy Updates

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Copy version.json
        run: cp version.json dist/
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Passo 5: Fazer uma Atualização

1. **Faça mudanças no código** (ex: mude uma cor, texto, etc)

2. **Atualize `version.json`:**
```json
{
  "version": "1.0.1",
  "buildNumber": 2,
  "releaseNotes": "✨ Nova funcionalidade X\n🐛 Correção de bug Y",
  "assetsUrl": "https://SEU_USUARIO.github.io/SEU_REPO",
  "forceUpdate": false,
  "minimumNativeVersion": "1.0.0"
}
```

3. **Commit e push:**
```bash
git add .
git commit -m "Update to v1.0.1"
git push
```

4. **GitHub Actions vai:**
   - Build automático
   - Deploy para GitHub Pages
   - Atualizar version.json

5. **Usuários com app instalado:**
   - Ao abrir o app, detecta nova versão
   - Mostra dialog "Atualização disponível"
   - Baixa e aplica automaticamente
   - Recarrega com novo conteúdo

## Como Funciona:

```
Você → Push no GitHub → GitHub Actions build → GitHub Pages
                                                      ↓
                                            App verifica a cada 30min
                                                      ↓
                                            Dialog "Atualização disponível"
                                                      ↓
                                            Download automático
                                                      ↓
                                            App reinicia com nova versão
```

## Testando Localmente:

```bash
# 1. Build
npm run build
npx cap sync android
cd android
./gradlew assembleDebug

# 2. Instale o APK
# 3. Mude algo (ex: cor de um botão)
# 4. Atualize version.json (buildNumber: 2)
# 5. Hospede version.json em algum servidor temporário
# 6. Abra o app → verá a notificação!
```

## Notas Importantes:

- ✅ Atualiza HTML/CSS/JS sem reinstalar APK
- ✅ Verifica automaticamente a cada 30 minutos
- ✅ Verifica ao abrir o app
- ✅ Botão manual para forçar verificação
- ❌ Não atualiza código nativo (Java/Kotlin) - precisa novo APK
- ❌ Não atualiza plugins Capacitor - precisa novo APK

Para código nativo/plugins, precisa:
1. Incrementar `versionCode` em `android/app/build.gradle`
2. Build novo APK
3. Distribuir via Play Store ou outro método
