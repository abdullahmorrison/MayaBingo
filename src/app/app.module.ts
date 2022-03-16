import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { DescriptionComponent } from './description/description.component';
import { BoardComponent } from './board/board.component';
import { SwitchComponent } from './switch/switch.component';
import { NewGameComponent } from './new-game/new-game.component';
import { FooterComponent } from './footer/footer.component';
import { BoardTileComponent } from './board-tile/board-tile.component';
import { ChipComponent } from './chip/chip.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DescriptionComponent,
    BoardComponent,
    SwitchComponent,
    NewGameComponent,
    FooterComponent,
    BoardTileComponent,
    ChipComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
