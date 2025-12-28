<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { updateService } from './services/updateService';

onMounted(() => {
  // Verifica atualizações ao iniciar o app nativo
  updateService.checkOnStartup();
  
  // Inicia verificação periódica
  updateService.startPeriodicCheck();
});
</script>
