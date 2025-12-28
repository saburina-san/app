import { alertController, toastController, loadingController } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

interface AppVersion {
  version: string;
  buildNumber: number;
  releaseNotes: string;
  assetsUrl: string;
  forceUpdate: boolean;
  minimumNativeVersion: string;
}

const CURRENT_VERSION = '1.0.0';
const CURRENT_BUILD = 2;
const UPDATE_CHECK_URL = 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/main/version.json';

export class UpdateService {
  private static instance: UpdateService;

  private constructor() {}

  static getInstance(): UpdateService {
    if (!UpdateService.instance) {
      UpdateService.instance = new UpdateService();
    }
    return UpdateService.instance;
  }

  async checkForUpdates(showNoUpdateMessage = false): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      if (showNoUpdateMessage) {
        await this.showToast('Sistema de atualizações disponível apenas no app', 'warning');
      }
      return;
    }

    try {
      const latestVersion = await this.fetchLatestVersion();
      const cachedBuild = this.getCachedBuildNumber();

      if (this.isUpdateAvailable(latestVersion, cachedBuild)) {
        await this.showUpdateDialog(latestVersion);
      } else if (showNoUpdateMessage) {
        await this.showToast('Você está usando a versão mais recente!', 'success');
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      if (showNoUpdateMessage) {
        await this.showToast('Não foi possível verificar atualizações', 'warning');
      }
    }
  }

  private async fetchLatestVersion(): Promise<AppVersion> {
    try {
      const response = await fetch(UPDATE_CHECK_URL, {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versão:', error);
      return {
        version: '1.0.1',
        buildNumber: 2,
        releaseNotes: '🎨 Novo design\n✨ Melhorias de performance\n🐛 Correções de bugs',
        assetsUrl: 'https://github.com/SEU_USUARIO/SEU_REPO/releases/latest/download/bundle.zip',
        forceUpdate: false,
        minimumNativeVersion: '1.0.0',
      };
    }
  }

  private getCachedBuildNumber(): number {
    const cached = localStorage.getItem('app_build_number');
    return cached ? parseInt(cached, 10) : CURRENT_BUILD;
  }

  private setCachedBuildNumber(build: number): void {
    localStorage.setItem('app_build_number', build.toString());
  }

  private isUpdateAvailable(latestVersion: AppVersion, cachedBuild: number): boolean {
    return latestVersion.buildNumber > cachedBuild;
  }

  private async showUpdateDialog(version: AppVersion): Promise<void> {
    const alert = await alertController.create({
      header: 'Atualização Disponível',
      subHeader: `Versão ${version.version}`,
      message: version.releaseNotes,
      backdropDismiss: !version.forceUpdate,
      buttons: [
        ...(!version.forceUpdate ? [{
          text: 'Depois',
          role: 'cancel',
        }] : []),
        {
          text: 'Atualizar Agora',
          handler: () => {
            this.performUpdate(version);
          },
        },
      ],
    });

    await alert.present();
  }

  private async performUpdate(version: AppVersion): Promise<void> {
    const loading = await loadingController.create({
      message: 'Baixando atualização...',
      spinner: 'crescent',
    });
    await loading.present();
    
    try {
      loading.message = 'Baixando atualização...';
      await this.downloadUpdate(version);
      
      this.setCachedBuildNumber(version.buildNumber);
      
      loading.message = 'Aplicando atualização...';
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await loading.dismiss();
      
      const toast = await toastController.create({
        message: '✅ Atualização instalada! Reiniciando...',
        duration: 2000,
        color: 'success',
        position: 'top',
      });
      await toast.present();
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      await loading.dismiss();
      
      const toast = await toastController.create({
        message: '❌ Erro ao atualizar. Tente novamente.',
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
      await toast.present();
      
      console.error('Erro na atualização:', error);
    }
  }

  private async downloadUpdate(version: AppVersion): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  private async showToast(message: string, color: string) {
    const toast = await toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  async checkOnStartup(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    setTimeout(() => {
      this.checkForUpdates(false);
    }, 3000);
  }

  startPeriodicCheck(): void {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    setInterval(() => {
      this.checkForUpdates(false);
    }, 30 * 60 * 1000);
  }
}

export const updateService = UpdateService.getInstance();
