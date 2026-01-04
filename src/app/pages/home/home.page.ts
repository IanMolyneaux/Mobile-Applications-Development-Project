import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { inject } from '@angular/core';

import { SpoonacularService } from 'src/app/services/spoonacular.service';
import { FavouritesService } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-home',
  // Template and styling for the Home page
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  // Standalone component configuration
  standalone: true,
  // Modules required for this page
  imports: [RouterModule, CommonModule, FormsModule, IonicModule],
})
export class HomePage {
  // For displaying on Home page as per requirement
  studentNumber = 'G00472915';
  // Toast controller inject using Angulars inject function. Used to display error feedback to the user
  private toast = inject(ToastController);
  // Search input and UI state
  query = '';
  loading = false;
  hasSearched = false;
  // Recipe results returnd from Spoonacular API
  results: Array<{ id: number; title: string; image: string }> = [];

  // Pagination state
  pageSize = 20; // Number of results per page
  pageIndex = 0; // Current page index
  totalResults = 0; // Total number of matching results

  // Shows favourite badges on recipe cards
  favIds = new Set<number>();

  // Constructor injects SpoonacularService, FavouritesService, and Router for API access, favourites management, and navigation to other pages
  constructor(
    private api: SpoonacularService,
    private favs: FavouritesService,
    private router: Router
  ) { }

  // Ionic lifecycle that runs each time the page becomes active. Ensures favourite badges are up to date
  async ionViewWillEnter() {
    await this.refreshFavIds();
  }

  // Calculates the offset based on current page index and page size
  private get offset(): number {
    return this.pageIndex * this.pageSize;
  }

  // Determines if the Previous page button should be enabled
  get canPrev(): boolean {
    return this.pageIndex > 0;
  }

  // Determines if the Next page button should be enabled
  get canNext(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.totalResults;
  }

  // Generates a page label for display in the UI
  get pageLabel(): string {
    const totalPages = Math.max(1, Math.ceil(this.totalResults / this.pageSize));
    return `Page ${this.pageIndex + 1} of ${totalPages}`;
  }

  // Refreshes the list of favourite recipe IDs for displaying badges on recipe cards
  async refreshFavIds() {
    const list = await this.favs.list();
    this.favIds = new Set(list.map(r => r.id));
  }

  // Triggered when the user initiates a search
  search(): void {
    const q = this.query.trim();
    if (!q) return;

    this.hasSearched = true;
    this.pageIndex = 0;
    this.loadPage();
  }

  // Resets search results when the query input is cleared and prevents "No Results Found" message from appearing too soon
  onQueryChange() {
    if (!this.query.trim()) {
      this.hasSearched = false;
      this.results = [];
      this.totalResults = 0;
      this.pageIndex = 0;
    }
  }

  // Lads a page of recipes from the Spoonacular API using the current query and pagination state
  loadPage(): void {
    const q = this.query.trim();
    if (!q) return;

    this.loading = true;

    this.api.searchRecipes(q, this.offset, this.pageSize).subscribe({
      next: async (res) => {
        this.results = res?.results || [];
        this.totalResults = res?.totalResults || 0;
        // Update favourites badges after loading results
        await this.refreshFavIds();
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        // Display an error if the API request fails
        const t = await this.toast.create({ message: 'Search failed.', duration: 2000 });
        await t.present();
      },
    });
  }

  // Loads the next page of results
  nextPage(): void {
    if (!this.canNext) return;
    this.pageIndex++;
    this.loadPage();
  }

  // Loads the previous page of results
  prevPage(): void {
    if (!this.canPrev) return;
    this.pageIndex--;
    this.loadPage();
  }

  // Navigates to the Recipe Details page for the selected recipe
  openDetails(id: number) {
    this.router.navigate(['/recipe', id]);
  }

}
