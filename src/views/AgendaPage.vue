<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Agenda</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="presentEventModal">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-datetime v-model="selectedDate" presentation="date" @ionChange="onDateChange"></ion-datetime>
      <ion-list>
        <ion-item v-for="event in eventsForSelectedDate" :key="event.id">
          <ion-label>
            <h2>{{ event.title }}</h2>
            <p>{{ event.startTime }} - {{ event.endTime }}</p>
          </ion-label>
          <ion-buttons slot="end">
            <ion-button @click="editEvent(event)">
              <ion-icon slot="icon-only" :icon="create"></ion-icon>
            </ion-button>
            <ion-button @click="deleteEvent(event.id)">
              <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonDatetime,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  modalController,
} from '@ionic/vue';
import { add, create, trash } from 'ionicons/icons';
import EventModal from './EventModal.vue';

interface Event {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
}

export default defineComponent({
  name: 'AgendaPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonDatetime,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
  },
  setup() {
    const selectedDate = ref(new Date().toISOString());
    const events = ref<Event[]>([]);
    let nextId = 1;

    const eventsForSelectedDate = computed(() => {
      const date = selectedDate.value.split('T')[0];
      return events.value.filter(event => event.date === date);
    });

    const onDateChange = (event: CustomEvent) => {
      selectedDate.value = event.detail.value;
    };

    const presentEventModal = async (eventToEdit?: Event) => {
      const modal = await modalController.create({
        component: EventModal,
        componentProps: {
          event: eventToEdit,
        },
      });
      await modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm' && data) {
        if (eventToEdit) {
          const index = events.value.findIndex(e => e.id === eventToEdit.id);
          if (index !== -1) {
            events.value[index] = { ...eventToEdit, ...data };
          }
        } else {
          events.value.push({
            id: nextId++,
            ...data,
            date: selectedDate.value.split('T')[0],
          });
        }
      }
    };

    const editEvent = (event: Event) => {
      presentEventModal(event);
    };

    const deleteEvent = (id: number) => {
      events.value = events.value.filter(event => event.id !== id);
    };

    return {
      selectedDate,
      eventsForSelectedDate,
      onDateChange,
      presentEventModal,
      editEvent,
      deleteEvent,
      add,
      create,
      trash,
    };
  },
});
</script>
