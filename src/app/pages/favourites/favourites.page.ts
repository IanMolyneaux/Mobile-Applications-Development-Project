import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
// import { NavController } from '@ionic/angular';

import { FavouritesService, FavouriteRecipe } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class FavouritesPage {
  favourites: FavouriteRecipe[] = [];

  constructor(private favs: FavouritesService, private router: Router) { }

  async ionViewWillEnter() {
    this.favourites = await this.favs.list();
  }

  openDetails(id: number) {
    this.router.navigate(['/recipe', id]);
  }

}
