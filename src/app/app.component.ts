import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { heartOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    addIcons({
      'heart-outline': heartOutline,
      'settings-outline': settingsOutline,
    });
  }
}
