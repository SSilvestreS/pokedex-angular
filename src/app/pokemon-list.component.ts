import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonService } from './pokemon.service';

@Component({
    selector: 'app-pokemon-list',
    standalone: false,
    template: `
    <div class="container">
        <h1>Pokedex - Kanto</h1>
        
        <div class="sort-buttons">
            <button 
                [class.active]="sortType === 'number'" 
                (click)="sortByNumber()">
                Por Número
            </button>
            <button 
                [class.active]="sortType === 'name'" 
                (click)="sortByName()">
                Alfabética
            </button>
        </div>

        <div class="pokemon-grid">
            <div *ngFor="let p of getSortedPokemons()" 
                 class="pokemon-card"
                 (click)="goToDetail(p.id)">
                <img [src]="p.image" [alt]="p.name" (error)="onImageError($event)">
                <h3>{{p.name}}</h3>
                <p>#{{p.id}}</p>
            </div>
        </div>

        <div class="pagination">
            <button 
                (click)="previousPage()" 
                [disabled]="currentPage === 1"
                class="page-btn">
                ← Anterior
            </button>
            
            <span class="page-info">
                Página {{currentPage}} de {{getTotalPages()}}
            </span>
            
            <button 
                (click)="nextPage()" 
                [disabled]="currentPage === getTotalPages()"
                class="page-btn">
                Próximo →
            </button>
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
            color: white;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .sort-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
        }
        .sort-buttons button {
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border: 2px solid white;
            background: white;
            color: #DC0A2D;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .sort-buttons button:hover {
            background: #f0f0f0;
            transform: translateY(-2px);
        }
        .sort-buttons button.active {
            background: #DC0A2D;
            color: white;
            border-color: white;
            box-shadow: 0 4px 12px rgba(220, 10, 45, 0.4);
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
            cursor: pointer;
        }
        .pokemon-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(220, 10, 45, 0.3);
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
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 40px;
            padding: 20px;
        }
        .page-btn {
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border: 2px solid white;
            background: white;
            color: #DC0A2D;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .page-btn:hover:not(:disabled) {
            background: #DC0A2D;
            color: white;
            transform: translateY(-2px);
        }
        .page-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            border-color: #ddd;
            color: #ddd;
            background: #f5f5f5;
        }
        .page-info {
            font-size: 16px;
            font-weight: 600;
            color: #DC0A2D;
            min-width: 150px;
            text-align: center;
        }
    `]
})
export class PokemonListComponent implements OnInit {
    pokemons: any[] = [];
    sortType: 'number' | 'name' = 'number';
    currentPage: number = 1;
    itemsPerPage: number = 20;
    
    constructor(
        private pokemonService: PokemonService,
        private router: Router,
        private route: ActivatedRoute
    ) {}
    
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['page']) {
                this.currentPage = +params['page'];
            }
            if (params['sort']) {
                this.sortType = params['sort'];
            }
        });

        this.pokemonService.getPokemonList(151, 0).subscribe({
            next: (data: any) => {
                this.pokemons = data.results.map((pokemon: any, index: number) => {
                    const id = index + 1;
                    return {
                        id: id,
                        name: pokemon.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                });
            },
            error: (error) => {
                console.error('Erro ao carregar lista de Pokémons:', error);
            }
        });
    }
    
    getSortedPokemons() {
        const sorted = this.sortType === 'name' 
            ? [...this.pokemons].sort((a, b) => a.name.localeCompare(b.name))
            : [...this.pokemons].sort((a, b) => a.id - b.id);
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return sorted.slice(startIndex, endIndex);
    }
    
    getTotalPages(): number {
        return Math.ceil(this.pokemons.length / this.itemsPerPage);
    }
    
    sortByNumber() {
        this.sortType = 'number';
        this.currentPage = 1;
    }
    
    sortByName() {
        this.sortType = 'name';
        this.currentPage = 1;
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
    
    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
        }
    }
    
    goToPage(page: number) {
        this.currentPage = page;
    }
    
    goToDetail(id: number) {
        this.router.navigate(['/pokemon', id], {
            queryParams: { 
                returnPage: this.currentPage,
                returnSort: this.sortType
            }
        });
    }
    
    onImageError(event: any) {
        const imgElement = event.target;
        if (!imgElement.src.includes('raw.githubusercontent.com')) {
            const pokemonId = imgElement.alt.match(/\d+/)?.[0] || '0';
            imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        } else {
            imgElement.src = 'https://via.placeholder.com/120x120?text=Pokemon';
        }
    }
}
