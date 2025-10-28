import { Component, OnInit } from '@angular/core';
import { PokemonService } from './pokemon.service';

@Component({
    selector: 'app-pokemon-list',
    standalone: false,
    template: `
    <div class="container">
        <h1> Pokedex</h1>
        <div class="pokemon-grid">
            <div *ngFor="let p of pokemons" class="pokemon-card">
            <img [src]="p.image" [alt]="p.name" (error)="onImageError($event)">
            <h3>{{p.name}}</h3>
            <p>#{{p.id}}</p>
            </div>
        </div>
    </div>
    `,
    styles:[`
        .container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        h1{
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .pokemon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        .pokemon-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .pokemon-card:hover {
            transform: translateY(-4px);
        }
        .pokemon-card img {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }
        .pokemon-card h3 {
            margin: 15px 0 5px;
            text-transform: capitalize;
            color: #333;
        }
        .pokemon-card p {
            color: #666;
            font-size: 14px;
        }
    `]
})
export class PokemonListComponent implements OnInit {
    pokemons: any[] = [];
    constructor(private pokemonService: PokemonService) {}
    
    ngOnInit() {
        for (let i = 1; i <= 151; i++) {
            this.pokemonService.getPokemon(i).subscribe((data: any) => {
                // Só adiciona se tiver imagem válida
                const imageUrl = data.sprites?.front_default || 
                                data.sprites?.other?.['official-artwork']?.front_default ||
                                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                
                if (imageUrl) {
                    this.pokemons.push({
                        id: data.id,
                        name: data.name,
                        image: imageUrl
                    });
                }
            });
        }
    }
    
    onImageError(event: any) {
        // Substitui por imagem padrão se falhar
        event.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    }
}