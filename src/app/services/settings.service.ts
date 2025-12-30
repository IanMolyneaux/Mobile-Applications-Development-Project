import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export type MeasurementUnit = 'metric' | 'us';
const KEY = 'measurement_unit';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private readyDone = false;

    constructor (private storage: Storage) {}

    private async ready() {
        if (!this.readyDone) {
            await this.storage.create();
            this.readyDone = true;
        }
    }

    async getMeasurement(unit: MeasurementUnit): Promise<void> {
        await this.ready();
        await this.storage.set(KEY, unit);
    }
}