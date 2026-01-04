import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

// Represents a simplified recipe object stored in the favourites list
export interface FavouriteRecipe {
    id: number;
    title: string;
    image: string;
}

// Storage key used to persist favourite recipes
const KEY = 'favourites';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
    // Ionic storage injected using Angular's inject() API for persistent local storage across sessions
    private storage = inject(Storage);
    // Ensures storage is fully initialised before use
    private ready: Promise<void>;

    // Constructor initialises the Ionic Storage instance while the ready promise guarantees storage is created only once
    constructor() {
        this.ready = this.storage.create().then(() => undefined);
    }

    // Ensures storage is ready before any read/write operation and prevents race conditions during app startup
    private async ensureReady() {
        await this.ready;
    }

    // Retrieves the full list of favourite recipes from storage and returns an empty array if no favourites exist
    async list(): Promise<FavouriteRecipe[]> {
        await this.ensureReady();
        return (await this.storage.get(KEY)) || [];
    }

    // Checks is a recipe is already saved as a favourite
    async isFavourite(id: number): Promise<boolean> {
        const favs = await this.list();
        return favs.some(r => r.id === id);
    }

    // Adds a recipe to the favourites list if it does not already exist
    async add(recipe: FavouriteRecipe): Promise<void> {
        await this.ensureReady();
        const items = await this.list();
        // prevents duplication of favourites
        if (!items.some(r => r.id === recipe.id)) {
            items.push(recipe);
            await this.storage.set(KEY, items);
        }
    }

    // Removes a recipe from the favourites list
    async remove(id: number): Promise<void> {
        await this.ensureReady();
        const items = await this.list();
        // Filter out the selected recipe and persist the updated list
        const next = items.filter(r => r.id !== id);
        await this.storage.set(KEY, next);
    }

    // Toggles a recipe's favourited status. Returns true if favourited, false if not
    async toggle(recipe: FavouriteRecipe): Promise<boolean> {
        if (await this.isFavourite(recipe.id)) {
            await this.remove(recipe.id);
            return false;
        }
        await this.add(recipe);
        return true;
    }
}