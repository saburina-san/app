<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ event ? 'Edit Event' : 'Add Event' }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismiss">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="floating">Title</ion-label>
      <ion-input v-model="formData.title"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>Start Time</ion-label>
      <ion-datetime-button datetime="start-time"></ion-datetime-button>
    </ion-item>
    <ion-item>
      <ion-label>End Time</ion-label>
      <ion-datetime-button datetime="end-time"></ion-datetime-button>
    </ion-item>
    <ion-button expand="block" @click="save" class="ion-margin-top">Save</ion-button>
  </ion-content>

  <ion-modal :keep-contents-mounted="true">
    <ion-datetime id="start-time" v-model="formData.startTime" presentation="time"></ion-datetime>
  </ion-modal>
  <ion-modal :keep-contents-mounted="true">
    <ion-datetime id="end-time" v-model="formData.endTime" presentation="time"></ion-datetime>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  modalController,
} from '@ionic/vue';

export default defineComponent({
  name: 'EventModal',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  },
  props: {
    event: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const formData = ref({
      title: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    });

    onMounted(() => {
      if (props.event) {
        formData.value.title = props.event.title;
        
        const today = new Date().toISOString().split('T')[0];

        if (props.event.startTime) {
            const [hours, minutes] = props.event.startTime.split(':');
            const startDate = new Date(today);
            startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            formData.value.startTime = startDate.toISOString();
        }

        if (props.event.endTime) {
            const [hours, minutes] = props.event.endTime.split(':');
            const endDate = new Date(today);
            endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            formData.value.endTime = endDate.toISOString();
        }
      }
    });

    const dismiss = () => {
      modalController.dismiss(null, 'cancel');
    };

    const save = () => {
      const data = {
        title: formData.value.title,
        startTime: new Date(formData.value.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: new Date(formData.value.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      modalController.dismiss(data, 'confirm');
    };

    return {
      formData,
      dismiss,
      save,
    };
  },
});
</script>
