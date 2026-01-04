import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface FavouriteRecipe {
    id: number;
    title: string;
    image: string;
}

const KEY = 'favourites';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
    private storage = inject(Storage);
    private ready: Promise<void>;

    constructor() {
        this.ready = this.storage.create().then(() => undefined);
    }

    private async ensureReady() {
        await this.ready;
    }

    async list(): Promise<FavouriteRecipe[]> {
        await this.ensureReady();
        return (await this.storage.get(KEY)) || [];
    }

    async isFavourite(id: number): Promise<boolean> {
        const favs = await this.list();
        return favs.some(r => r.id === id);
    }

    async add(recipe: FavouriteRecipe): Promise<void> {
        await this.ensureReady();
        const items = await this.list();
        if (!items.some(r => r.id === recipe.id)) {
            items.push(recipe);
            await this.storage.set(KEY, items);
        }
    }

    async remove(id: number): Promise<void> {
        await this.ensureReady();
        const items = await this.list();
        const next = items.filter(r => r.id !== id);
        await this.storage.set(KEY, next);
    }

    async toggle(recipe: FavouriteRecipe): Promise<boolean> {
        if (await this.isFavourite(recipe.id)) {
            await this.remove(recipe.id);
            return false;
        }
        await this.add(recipe);
        return true;
    }
}