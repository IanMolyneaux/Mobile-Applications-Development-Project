import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsService, MeasurementUnit } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  // Template and styling for the Settings page
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  // Standalone component configuration
  standalone: true,
  // Required modules for this page
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsPage {
  // Stores the selected measurement unit (metric is default)
  measurement: MeasurementUnit = 'metric';

  // Constructor injects SettingsService for persisting and retrieving user settings
  constructor(private settings: SettingsService) {}

  // Ionic lifecycle that runs each time the page becomes active. Loads the current measurement setting
  async ionViewWillEnter() {
    this.measurement = await this.settings.getMeasurement();
  }

  // Saves the selected measurement unit when changed by the user
  async save() {
    await this.settings.setMeasurement(this.measurement);
  }

}
