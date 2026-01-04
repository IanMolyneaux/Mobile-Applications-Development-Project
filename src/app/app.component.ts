import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { heartOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  // Root application template
  templateUrl: 'app.component.html',
  // Standalone root component
  standalone: true,
  // Required modules
  imports: [IonicModule],
})
export class AppComponent {
  // Registers custome icons so they can be used throughout the app without additional imports
  constructor() {
    // Makes heart and settings icons available globally
    addIcons({
      'heart-outline': heartOutline,
      'settings-outline': settingsOutline,
    });
  }
}
