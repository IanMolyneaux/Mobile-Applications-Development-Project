import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

import { SpoonacularService } from 'src/app/services/spoonacular.service';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonList, 
  IonThumbnail, 
  IonProgressBar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonText, 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonList, 
    IonThumbnail, 
    IonProgressBar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonText,
  ],
})
export class HomePage {
  studentNumber = 'G00472915';

  query = '';
  loading = false;

  results: Array<{ id: number; title: string; image: string }> = [];

  pageSize = 20;
  pageIndex = 0;
  totalResults = 0;

  constructor(
    private api: SpoonacularService,
    private nav: NavController,
    private toast: ToastController
  ) { }

  private get offset(): number {
    return this.pageIndex * this.pageSize;
  }

  get canPrev(): boolean {
    return this.pageIndex > 0;
  }

  get canNext(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.totalResults;
  }

  get pageLabel(): string {
    const totalPages = Math.max(1, Math.ceil(this.totalResults / this.pageSize));
    return `Page ${this.pageIndex + 1} of ${totalPages}`;
  }

  search(): void {
    const q = this.query.trim();
    if (!q) return;

    this.pageIndex = 0;
    this.loadPage();
  }

  loadPage(): void {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;

    this.api.searchRecipes(q, this.offset, this.pageSize).subscribe({
      next: (res) => {
        this.results = res?.results || [];
        this.totalResults = res?.totalResults || 0;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: 'Search failed.', duration: 2000 });
        await t.present();
      },
    });
  }

  nextPage(): void {
    if (!this.canNext) return;
    this.pageIndex++;
    this.loadPage();
  }

  prevPage(): void {
    if (!this.canPrev) return;
    this.pageIndex--;
    this.loadPage();
  }

  openDetails(id: number) {
    this.nav.navigateForward(`/recipe/${id}`);
  }

}
