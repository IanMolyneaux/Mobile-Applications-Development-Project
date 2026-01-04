import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

import { FavouritesService, FavouriteRecipe } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-favourites',
  // Template and styling for the Favourites page 
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  // Standalone component configuration
  standalone: true,
  // Modules required for this page
  imports: [IonicModule, CommonModule, RouterModule],
})
export class FavouritesPage {
  // Array holding all reciped marked as favourites by the user
  favourites: FavouriteRecipe[] = [];

  // Constructor injects FavouritesService and Router to manage favourites and navigation
  constructor(private favs: FavouritesService, private router: Router) { }

  // Lifecycle hook that runs every time the page becomes active. Ensures favourites list is up to date
  async ionViewWillEnter() {
    this.favourites = await this.favs.list();
  }

  // Navigates to the Recipe Details page for the selected recipe
  openDetails(id: number) {
    this.router.navigate(['/recipe', id]);
  }

}
