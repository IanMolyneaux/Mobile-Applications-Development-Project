import { Routes } from '@angular/router';

// Application routing configuration defining all pages and how they are loaded
export const routes: Routes = [
  // Default route. Redirects an empty path to the Home page
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Home page route. Allows user to search for recipes by ingredients
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
  },
  // Settings page route. Allows users to select their preferred measurement unit
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage),
  },
  // Favourites page route. Displays recipes saved by the user
  {
    path: 'favourites',
    loadComponent: () => import('./pages/favourites/favourites.page').then( m => m.FavouritesPage),
  },
  // Recipe details page route. Uses a route parameter to load details for a specific recipe
  {
    path: 'recipe/:id',
    loadComponent: () => import('./pages/recipe-details/recipe-details.page').then( m => m.RecipeDetailsPage),
  },
  // Redirects and unknown paths back to the Home page to prevent users from landing on a blank or invalid page
  { path: '**', redirectTo: 'home' },
];
