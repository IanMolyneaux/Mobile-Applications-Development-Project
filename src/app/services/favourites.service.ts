import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface FavouriteRecipe {
    id: number;
    title: string;
    image: string;
}

const KEY = 'favourite_recipes';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
    private readyDone = false;

    constructor (private storage: Storage) {}

    private async ready() {
        if (!this.readyDone) {
            await this.storage.create();
            this.readyDone = true;
        }
    }

    async list(): Promise<FavouriteRecipe[]> {
        await this.ready();
        return (await this.storage.get(KEY)) || [];
    }

    async isFavourite(id: number): Promise<boolean> {
        const favs = await this.list();
        return favs.some(r => r.id === id);
    }

    async add(recipe: FavouriteRecipe): Promise<void> {
        const favs = await this.list();
        if (!favs.some(r => r.id === recipe.id)) {
            favs.unshift(recipe);
            await this.storage.set(KEY, favs);
        }
    }

    async remove(id: number): Promise<void> {
        const favs = await this.list();
        await this.storage.set(KEY, favs.filter(r => r.id !== id));
    }
}