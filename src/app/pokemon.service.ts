import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PokemonService {private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
    constructor(private http: HttpClient) {}
    getPokemon(id: number){return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
}