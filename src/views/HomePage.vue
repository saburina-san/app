<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="checkUpdates">
            <ion-icon slot="icon-only" :icon="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <div class="app-logo">
          <ion-icon :icon="calendar" size="large" color="primary"></ion-icon>
        </div>
        <h1>Agenda App</h1>
        <p class="version-info">Versão 1.0.0 (Build 1)</p>
        
        <div class="button-container">
          <ion-button router-link="/agenda" expand="block" size="large" class="primary-button">
            <ion-icon slot="start" :icon="calendar"></ion-icon>
            Abrir Agenda
          </ion-button>
          
          <ion-button @click="checkUpdates" expand="block" fill="outline" size="default" class="secondary-button">
            <ion-icon slot="start" :icon="refresh"></ion-icon>
            Verificar Atualizações
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/vue';
import { calendar, refresh } from 'ionicons/icons';
import { updateService } from '../services/updateService';

const checkUpdates = () => {
  updateService.checkForUpdates(true);
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 20px;
}

.app-logo {
  margin-bottom: 20px;
}

.app-logo ion-icon {
  font-size: 80px;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 10px 0;
  color: var(--ion-color-dark);
}

.version-info {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 40px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.primary-button {
  --border-radius: 12px;
  font-weight: 600;
  height: 56px;
}

.secondary-button {
  --border-radius: 12px;
  height: 48px;
}
</style>
