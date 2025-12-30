import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

import { SpoonacularService } from 'src/app/services/spoonacular.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule, FormsModule]
})
export class HomePage {
  studentNumber = 'G00472915';

  query = '';
  loading = false;

  results: Array<{ id: number; title: string; image: string }> = [];

  constructor(
    private api: SpoonacularService,
    private nav: NavController,
    private toast: ToastController
  ) { }

  search() {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;

    this.api.searchRecipes(q).subscribe({
      next: (res) => {
        this.results = res?.results || [];
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: 'Search failed.', duration: 2000})
        await t.present();
      },
    });
  }

  openDetails(id: number) {
    this.nav.navigateForward(`/recipe/${id}`);
  }

}
