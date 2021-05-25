import { HttpService } from './../../services/http.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { APIResponse, Game } from 'src/app/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string = 'Name';
  public games: Array<Game> = [];
  private routeSub: Subscription;
  private gameSub: Subscription;

  constructor(private httpService: HttpService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params)=>{

      //if there is a search query param, call searchGames method with this param
      if(params['game-search']){
        this.searchGames('metacrit', params['game-search'])
      }else{
        this.searchGames('metacrit');
      }
    })

    console.log(this.routeSub)
  }
  searchGames(sort: string, search?: string):void {
    this.gameSub = this.httpService.getGameList(sort, search)
    .subscribe((gameList: APIResponse<Game>)=>{
      this.games = gameList.results;
      console.log(gameList)
    })
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy():void{
    if(this.gameSub){
      this.gameSub.unsubscribe();
    }

    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
