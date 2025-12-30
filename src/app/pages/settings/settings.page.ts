import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsService, MeasurementUnit } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class SettingsPage {
  measurement: MeasurementUnit = 'metric';

  constructor(private settings: SettingsService) {}

  async ionViewWillEnter() {
    this.measurement = await this.settings.getMeasurement();
  }

  async save() {
    await this.settings.setMeasurement(this.measurement);
  }

}
