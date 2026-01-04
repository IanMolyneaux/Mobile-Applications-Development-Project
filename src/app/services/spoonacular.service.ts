import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ComplexSearchResponse {
    results: Array<{ id: number; title: string; image: string; }>;
    totalResults: number;
}

export interface RecipeInformationResponse {
    id: number;
    title: string;
    image: string;
    extendedIngredients: Array<{ 
        id: number; 
        original: string; 
        image?: string;
        measures: {
            us: { amount: number; unitLong: string };
            metric: { amount: number; unitLong: string };
        };
    }>;
    analyzedInstructions: Array<{
        steps: Array<{ number: number; step: string }>;
    }>;
}
    
@Injectable({ providedIn: 'root' })
export class SpoonacularService {
    private http = inject(HttpClient);
    private baseUrl = environment.spoonacularBaseUrl;
    private apiKey = environment.spoonacularApiKey;

    private url(path: string) {
        const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
        return base + path.replace(/^\//, '');
    }

    // Home page API: Search Recipies
    searchRecipes(query: string, offset: number = 0, number: number = 20): Observable<ComplexSearchResponse> {
        const params = new HttpParams({
            fromObject: {
                apiKey: this.apiKey,
                query,
                number: String(number),
                offset: String(offset),
            },
        });
        return this.http.get<ComplexSearchResponse>(this.url('recipes/complexSearch'), { params });
    }

    // Details page API: Get Recipe Information
    getRecipeInformation(id: number): Observable<RecipeInformationResponse> {
        const params = new HttpParams().set('apiKey', this.apiKey);

        return this.http.get<RecipeInformationResponse>(this.url(`recipes/${id}/information`), { params });
    }

}