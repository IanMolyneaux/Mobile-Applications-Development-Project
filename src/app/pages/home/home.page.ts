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
  IonProgressBar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonBadge,
  IonNote,
  IonText, 
} from '@ionic/angular/standalone';
import { FavouriteService } from 'src/app/services/favourites.service';

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
    IonProgressBar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonNote,
    IonText,
  ],
})
export class HomePage {
  studentNumber = 'G00472915';

  query = '';
  loading = false;
  hasSearched = false;

  results: Array<{ id: number; title: string; image: string }> = [];

  // Pagination state
  pageSize = 20;
  pageIndex = 0;
  totalResults = 0;

  // Shows favourite badges on recipe cards
  favIds = new Set<number>();

  constructor(
    private api: SpoonacularService,
    private favs: FavouriteService,
    private nav: NavController,
    private toast: ToastController
  ) { }

  async ionViewWillEnter() {
    await this.refreshFavIds();
  }

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

  async refreshFavIds() {
    const list = await this.favs.list();
    this.favIds = new Set(list.map(r => r.id));
  }

  search(): void {
    const q = this.query.trim();
    if (!q) return;

    this.hasSearched = true;
    this.pageIndex = 0;
    this.loadPage();
  }

  onQueryChange() {
    if (!this.query.trim()) {
      this.hasSearched = false;
      this.results = [];
      this.totalResults = 0;
    }
  }

  loadPage(): void {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;

    this.api.searchRecipes(q, this.offset, this.pageSize).subscribe({
      next: async (res) => {
        this.results = res?.results || [];
        this.totalResults = res?.totalResults || 0;
        await this.refreshFavIds();
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
