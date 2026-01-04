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
  // Template and styling for the Recipe Details page
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
  // Standalone component configuration
  standalone: true,
  // Required modules for this page
  imports: [IonicModule, CommonModule],
})
export class RecipeDetailsPage {
  // Toast controller injected using Angulars inject function for displaying feedback to the user
  private toast = inject(ToastController);
  // Indicates whether recipe data is being loaded
  loading = true;
  // Holds the full recipe information returned from the Spoonacular API
  recipe?: RecipeInformationResponse;

  // Measurement unit setting (defaults to metric)
  measurement: MeasurementUnit = 'metric';
  isFavourite = false;

  /**
   * Contructor injects ActivatedRoute, SpoonacularService, SettingsService, and FavouritesService for 
   * reading recipe ID, retrieving information from the API, retriving user-selected settings and managing favourite recipes in storage
  */
  constructor(
    private route: ActivatedRoute,
    private api: SpoonacularService,
    private settings: SettingsService,
    private favs: FavouritesService
  ) {}

  // Returns the list of instruction steps for the recipe or an empty arry if none are available
  get steps() {
    return this.recipe?.analyzedInstructions?.[0]?.steps || [];
  }

  // Ionic lifecycle that runs each time the page becomes active. Loads recipe details, user settings, and favourite status
  async ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    // Loads user measurement preference and favourite status
    this.measurement = await this.settings.getMeasurement();
    this.isFavourite = await this.favs.isFavourite(id);
    // Fetches recipe information from Spoonacular API
    this.api.getRecipeInformation(id).subscribe({
      next: (info) => {
        this.recipe = info;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        // Displays an error message if recipe data fails to load
        const t = await this.toast.create({ message: 'Failed to load recipe details.', duration: 2000})
        await t.present();
      }
    });
  }

  // Generates the full URL for an ingredient image. Returns null if no image is available
  ingredientImageURL(image?: string): string | null {
    if (!image) return null;
    return `https://spoonacular.com/cdn/ingredients_100x100/${image}`;
  }

  // Returns the formatted ingredient amount based on the selected measurement system
  amount(ing: any): string {
    const m = this.measurement === 'us' ? ing.measures?.us : ing.measures?.metric;
    if (!m) return '';
    // Formats to 2 decimal places and removes trailing
    return Number(m.amount).toFixed(2).replace(/\.00$/, '');
  }

  // Retuns the unit name based on the selected measurement system
  unit(ing: any): string {
    const m = this.measurement === 'us' ? ing.measures?.us : ing.measures?.metric;
    return m?.unitLong || '';
  }

  // Adds or removes the current recipe from favourites list and updates hte UI displaying a confirmation message
  async toggleFavourite() {
    if (!this.recipe) return;

    if (this.isFavourite) {
      await this.favs.remove(this.recipe.id);
      this.isFavourite = false;
    } else {
      await this.favs.add({ id: this.recipe.id, title: this.recipe.title, image: this.recipe.image});
      this.isFavourite = true;
    }

    // Displays feedback message after updating favourites
    const t = await this.toast.create({
      message: this.isFavourite ? 'Added to favourites' : 'Removed from favourites',
      duration: 1500
    });
    await t.present();
  }

}
