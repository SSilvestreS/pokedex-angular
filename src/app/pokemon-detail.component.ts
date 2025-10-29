import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: false,
  template: `
    <div class="detail-container" *ngIf="pokemon">
      <button class="back-button" (click)="goBack()">
        ← Voltar para Lista
      </button>
      
      <div class="detail-card">
        <div class="detail-header">
          <h1>{{pokemon.name}}</h1>
          <span class="pokemon-number">#{{pokemon.id}}</span>
        </div>
        
        <div class="detail-content">
          <div class="image-section">
            <img [src]="pokemon.image" [alt]="pokemon.name">
          </div>
          
          <div class="info-section">
            <div class="info-group">
              <h3>Informações Básicas</h3>
              <p><strong>Altura:</strong> {{pokemon.height / 10}} m</p>
              <p><strong>Peso:</strong> {{pokemon.weight / 10}} kg</p>
              <p><strong>Experiência Base:</strong> {{pokemon.base_experience}}</p>
            </div>
            
            <div class="info-group">
              <h3>Tipos</h3>
              <div class="types">
                <span *ngFor="let type of pokemon.types" 
                      [class]="'type-badge type-' + type.type.name">
                  {{type.type.name}}
                </span>
              </div>
            </div>
            
            <div class="info-group">
              <h3>Habilidades</h3>
              <div class="abilities">
                <span *ngFor="let ability of pokemon.abilities" class="ability-badge">
                  {{ability.ability.name}}
                </span>
              </div>
            </div>
            
            <div class="info-group">
              <h3>Status Base</h3>
              <div class="stats">
                <div *ngFor="let stat of pokemon.stats" class="stat-row">
                  <span class="stat-name">{{stat.stat.name}}:</span>
                  <div class="stat-bar-container">
                    <div class="stat-bar" [style.width.%]="(stat.base_stat / 255) * 100"></div>
                  </div>
                  <span class="stat-value">{{stat.base_stat}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="!pokemon">
      <p>Carregando...</p>
    </div>
  `,
  styles: [`
    .detail-container {
      min-height: 100vh;
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .back-button {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }
    .back-button:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    .detail-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 15px;
    }
    .detail-header h1 {
      text-transform: capitalize;
      color: #333;
      font-size: 36px;
      margin: 0;
    }
    .pokemon-number {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
    }
    .detail-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 40px;
    }
    .image-section {
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .image-section img {
      width: 100%;
      max-width: 300px;
      height: auto;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
    }
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    .info-group h3 {
      color: #667eea;
      margin-bottom: 12px;
      font-size: 20px;
    }
    .info-group p {
      margin: 8px 0;
      font-size: 16px;
      color: #555;
    }
    .types, .abilities {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .type-badge, .ability-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: capitalize;
      font-size: 14px;
    }
    .type-badge {
      color: white;
      background: #667eea;
    }
    .ability-badge {
      background: #f0f0f0;
      color: #333;
    }
    .stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .stat-row {
      display: grid;
      grid-template-columns: 150px 1fr 50px;
      align-items: center;
      gap: 10px;
    }
    .stat-name {
      font-weight: 600;
      text-transform: capitalize;
      color: #555;
    }
    .stat-bar-container {
      background: #e0e0e0;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
    }
    .stat-bar {
      background: linear-gradient(90deg, #667eea, #764ba2);
      height: 100%;
      transition: width 0.5s ease;
    }
    .stat-value {
      font-weight: bold;
      color: #667eea;
      text-align: right;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-size: 24px;
      color: #667eea;
    }
    @media (max-width: 768px) {
      .detail-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonService.getPokemonDetails(+id).subscribe({
        next: (data: any) => {
          this.pokemon = {
            ...data,
            image: data.sprites?.other?.['official-artwork']?.front_default || 
                   data.sprites?.front_default ||
                   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          };
        },
        error: (error) => {
          console.error(`Erro ao carregar detalhes do Pokémon ${id}:`, error);
          this.pokemon = null;
        }
      });
    }
  }

  goBack() {
    const returnPage = this.route.snapshot.queryParamMap.get('returnPage');
    const returnSort = this.route.snapshot.queryParamMap.get('returnSort');
    
    this.router.navigate(['/'], {
      queryParams: {
        page: returnPage || '1',
        sort: returnSort || 'number'
      }
    });
  }
}
