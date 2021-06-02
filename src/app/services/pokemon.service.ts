import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  //API URL wird definiert, zu finden in src>environments>environment.prod.ts
  private url: string = environment.apiUrl + 'pokemon/';
 //Pokemon array -> hält die Daten von den API calls
 private _pokemons: any[] = [];
 //diese variable hält die nächste URL von der wird Daten fetchen
  private _next: string = '';

  //der http client macht unsere http requests,
  // Observables -> https://angular.io/guide/observables
  constructor(private http: HttpClient) {
  }

  get pokemons(): any[] {
    return this._pokemons;
  }

  get next(): string {
    return this._next;
  }

  set next(next: string) {
    this._next = next;
  }
// hier wird einfach der pokemon typ zurückgegeben
  getType(pokemon: any): string {
    return pokemon && pokemon.types.length > 0 ? pokemon.types[0].type.name : '';
  }
// Hier die API endpoint call methoden (einzelne Pokemon, die nächsten, Spezies und die Evolution)
  get(name: string): Observable<any> {
    const url = `${this.url}${name}`;
    return this.http.get<any>(url);
  }

  getNext(): Observable<any> {
    const url = this.next === '' ? `${this.url}?limit=100` : this.next;
    return this.http.get<any>(url);
  }

  getEvolution(id: number): Observable<any> {
    const url = `${environment.apiUrl}evolution-chain/${id}`;
    return this.http.get<any>(url);
  }

  getSpecies(name: string): Observable<any> {
    const url = `${environment.apiUrl}pokemon-species/${name}`;
    return this.http.get<any>(url);
  }
}
