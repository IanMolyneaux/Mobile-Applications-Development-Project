import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';

import { SpoonacularService, RecipeInformationResponse } from 'src/app/services/spoonacular.service';
import { SettingsService, MeasurementUnit } from 'src/app/services/settings.service';
import { FavouritesService } from 'src/app/services/favourites.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class RecipeDetailsPage {
  private toast = inject(ToastController);
  loading = true;
  recipe?: RecipeInformationResponse;

  measurement: MeasurementUnit = 'metric';
  isFavourite = false;

  constructor(
    private route: ActivatedRoute,
    private api: SpoonacularService,
    private settings: SettingsService,
    private favs: FavouritesService
  ) {}

  get steps() {
    return this.recipe?.analyzedInstructions?.[0]?.steps || [];
  }

  async ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.measurement = await this.settings.getMeasurement();
    this.isFavourite = await this.favs.isFavourite(id);

    this.api.getRecipeInformation(id).subscribe({
      next: (info) => {
        this.recipe = info;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        const t = await this.toast.create({ message: 'Failed to load recipe details.', duration: 2000})
        await t.present();
      }
    });
  }

  ingredientImageURL(image?: string): string | null {
    if (!image) return null;
    return `https://spoonacular.com/cdn/ingredients_100x100/${image}`;
  }

  amount(ing: any): string {
    const m = this.measurement === 'us' ? ing.measures?.us : ing.measures?.metric;
    if (!m) return '';
    return Number(m.amount).toFixed(2).replace(/\.00$/, '');
  }

  unit(ing: any): string {
    const m = this.measurement === 'us' ? ing.measures?.us : ing.measures?.metric;
    return m?.unitLong || '';
  }

  async toggleFavourite() {
    if (!this.recipe) return;

    if (this.isFavourite) {
      await this.favs.remove(this.recipe.id);
      this.isFavourite = false;
    } else {
      await this.favs.add({ id: this.recipe.id, title: this.recipe.title, image: this.recipe.image});
      this.isFavourite = true;
    }

    const t = await this.toast.create({
      message: this.isFavourite ? 'Added to favourites' : 'Removed from favourites',
      duration: 1500
    });
    await t.present();
  }

}
