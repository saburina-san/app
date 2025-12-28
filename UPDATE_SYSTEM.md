# Sistema de Atualizações Automáticas - Agenda App

## ✅ O que foi implementado:

### 1. Service Worker (`public/service-worker.js`)
- Cache de recursos para funcionamento offline
- Atualização automática de conteúdo
- PWA completo

### 2. Update Service (`src/services/updateService.ts`)
- Verificação automática de atualizações ao iniciar
- Botão manual para verificar atualizações
- Dialog de atualização com release notes
- Atualização forçada ou opcional

### 3. PWA Manifest (`public/manifest.json`)
- Configuração para instalar como app
- Ícones e tema

## 🚀 Como funciona:

### Para o usuário:
1. App verifica atualizações automaticamente ao abrir
2. Mostra dialog quando há nova versão
3. Usuário pode atualizar imediatamente ou depois
4. Após atualizar, app recarrega com novo conteúdo

### Para o desenvolvedor:
1. Faça alterações no código
2. Build: `npm run build`
3. Sync: `npx cap sync android`
4. Build APK: `cd android && ./gradlew assembleDebug`
5. Usuários receberão atualização ao abrir o app

## 🔄 Hospedando atualizações:

### Opção 1: GitHub Pages (Grátis)
```bash
# Build
npm run build

# Deploy no GitHub Pages
# Configure no repo: Settings > Pages > Source: gh-pages branch
```

### Opção 2: Netlify/Vercel (Grátis)
- Conecte seu repositório
- Auto-deploy a cada commit
- URLs públicas automáticas

### Opção 3: Servidor próprio
Crie um arquivo `version.json` no seu servidor:
```json
{
  "version": "1.0.1",
  "buildNumber": 2,
  "releaseNotes": "- Nova funcionalidade X\\n- Correção de bug Y",
  "updateUrl": "https://seu-servidor.com",
  "forceUpdate": false
}
```

## 📱 Testando:

1. Build e instale o APK atual
2. Faça uma alteração (ex: mude uma cor)
3. Build novamente
4. Incremente o buildNumber em `updateService.ts`
5. Abra o app instalado - ele detectará a atualização!

## 🎯 Próximos passos:

- [ ] Configurar URL do servidor de atualizações
- [ ] Hospedar em GitHub Pages/Netlify
- [ ] Criar API para retornar version.json
- [ ] Adicionar analytics de atualizações
