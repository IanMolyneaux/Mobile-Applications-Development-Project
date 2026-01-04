import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export type MeasurementUnit = 'metric' | 'us';
const KEY = 'measurement_unit';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private storage = inject(Storage);
    private readyDone = false;

    private async ready() {
        if (!this.readyDone) {
            await this.storage.create();
            this.readyDone = true;
        }
    }

    async getMeasurement(): Promise<MeasurementUnit> {
        await this.ready();
        const value = await this.storage.get(KEY);
        return (value === 'us' || value === 'metric') ? value : 'metric';
    }

    async setMeasurement(unit: MeasurementUnit): Promise<void> {
        await this.ready();
        await this.storage.set(KEY, unit);
    }
}