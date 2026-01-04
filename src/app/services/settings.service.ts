import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// Defines the supported measurement systems used throughout to ensure type safety
export type MeasurementUnit = 'metric' | 'us';
// Storage key used to persist the user's measurement preference
const KEY = 'measurement_unit';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    // Ionic Storage injected using Angular's inject() to provide persistent local storage across sessions
    private storage = inject(Storage);
    // Tracks if storage has been initialized
    private readyDone = false;

    // Ensures Ionic Storage is initialized before use and prevents repeated calls to storage.create()
    private async ready() {
        if (!this.readyDone) {
            await this.storage.create();
            this.readyDone = true;
        }
    }

    // Retrieves the saved measurement unit from storage. If no value exists, defaults to metric
    async getMeasurement(): Promise<MeasurementUnit> {
        await this.ready();
        const value = await this.storage.get(KEY);
        // Validates stored value and falls back to metric if necessary
        return (value === 'us' || value === 'metric') ? value : 'metric';
    }

    // Persists the selected measurement unit in storage
    async setMeasurement(unit: MeasurementUnit): Promise<void> {
        await this.ready();
        await this.storage.set(KEY, unit);
    }
}