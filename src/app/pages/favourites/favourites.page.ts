import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NavController } from '@ionic/angular';

import { FavouriteService, FavouriteRecipe } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class FavouritesPage {
  favourites: FavouriteRecipe[] = [];

  constructor(private favs: FavouriteService, private nav: NavController) { }

  async ionViewWillEnter() {
    this.favourites = await this.favs.list();
  }

  openDetails(id: number) {
    this.nav.navigateForward(`/recipe/${id}`);
  }

}
