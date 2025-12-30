import { Injectable } from '@angular/core';
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
    private baseUrl = environment.spoonacularBaseUrl;
    private apiKey = environment.spoonacularApiKey;

    constructor(private http: HttpClient) {}

    // Home page API: Search Recipies
    searchRecipes(query: string): Observable<ComplexSearchResponse> {
        const params = new HttpParams()
            .set('apiKey', this.apiKey)
            .set('query', query)
            .set('number', '20'); // Limit to 20 results

        return this.http.get<ComplexSearchResponse>(`${this.baseUrl}recipes/complexSearch`, { params });
    }

    // Details page API: Get Recipe Information
    getRecipeInformation(id: number): Observable<RecipeInformationResponse> {
        const params = new HttpParams()
            .set('apiKey', this.apiKey);

        return this.http.get<RecipeInformationResponse>(`${this.baseUrl}recipes/${id}/information`, { params });
    }

}