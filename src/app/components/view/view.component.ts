import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  pokemon: any = null;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {

/* Oninit schaun wir ob unser Pokemon Array das Pokemon hat nach dem wir suchen
und bekommen die Evolution Details. Wenn nicht callen wir ein einzelnes get service
und danach call an die evolution methode
 */
    this.subscription = this.route.params.subscribe(params => {

      if (this.pokemonService.pokemons.length) {
        this.pokemon = this.pokemonService.pokemons.find(i => i.name === params.name);
        if (this.pokemon) {
          this.getEvolution();
          return;
        }
      }

      this.subscription = this.pokemonService.get(params.name).subscribe(response => {
        this.pokemon = response;
        this.getEvolution();
      }, error => console.log('Error Occurred:', error));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }


/*   Wenn es keine Evolutions gibt machen wir einen call um an die evolution Details zu kommen
  Dazu brauchen wir die id vom base pokemon (methoden getevolves und getid)
 */
  getEvolution() {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.subscription = this.pokemonService.getSpecies(this.pokemon.name).subscribe(response => {
        const id = this.getId(response.evolution_chain.url);
        this.subscription = this.pokemonService.getEvolution(id).subscribe(response => this.getEvolves(response.chain));
      });
    }
  }

  //Die chain property hat hier ein nested objekt welches namen und ids vom evoltuion pokemon hält
  //mit dieser rekursiven funktion bekommen wir das evolutions array zurückgegeben welches
  getEvolves(chain: any) {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });

   // Hier kommt das array retour mit name und id von den evolution details
    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

//Hier holen wir uns die Pokemon ID von der Evolution Chain URL https://pokeapi.co/docs/v2#evolution-section

  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }

}
