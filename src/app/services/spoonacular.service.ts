import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Response structure for the Spoonacular API Complex Recipe Search
export interface ComplexSearchResponse {
    results: Array<{ id: number; title: string; image: string; }>;
    totalResults: number;
}

// Response structure for the Spoonacular API Get Recipe Information
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
    // HttpClient injected using Angular's inject() API to communicate with the Spoonacular REST API
    private http = inject(HttpClient);
    // Base API URL and API key loaded from environment configuration
    private baseUrl = environment.spoonacularBaseUrl;
    private apiKey = environment.spoonacularApiKey;

    // Builds a safe API URL by normalising slashes and prevents double slashes or malformed URLS
    private url(path: string) {
        const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
        return base + path.replace(/^\//, '');
    }

    // Home page API searches for recipes that match the ingredient query
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

    // Details page API retireves full information for a single recipe
    getRecipeInformation(id: number): Observable<RecipeInformationResponse> {
        const params = new HttpParams().set('apiKey', this.apiKey);

        return this.http.get<RecipeInformationResponse>(this.url(`recipes/${id}/information`), { params });
    }

}