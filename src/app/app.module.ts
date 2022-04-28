import { Board } from './../store/board/board.model';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//ngrx
import { StoreModule, MetaReducer, Action, ActionReducer, INIT } from '@ngrx/store';
import { boardReducer } from 'src/store/board/board.reducers';
//devtools
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

//components
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { DescriptionComponent } from './description/description.component';
import { BoardComponent } from './board/board.component';
import { SwitchComponent } from './switch/switch.component';
import { NewGameComponent } from './new-game/new-game.component';
import { FooterComponent } from './footer/footer.component';
import { BoardTileComponent } from './board-tile/board-tile.component';
import { ChipComponent } from './chip/chip.component';
import { ModalComponent } from './modal/modal.component';

export function storageMetaReducer(reducer: ActionReducer<any>) {
  return function (state: Board, action: Action) {
    let nextState = reducer(state, action)

    // if a user is visiting the site for the first time (no local storage)
    if (localStorage.length == 0) {
      // shuffle the board
      nextState.board.tiles = nextState.board.tiles.sort(() => Math.random() - 0.5)
      //save initial state
      localStorage.setItem('Board Type', JSON.stringify(nextState.board.type))
      localStorage.setItem('Alveus Board', JSON.stringify(nextState.board.tiles))
      localStorage.setItem('Alveus Bingo', JSON.stringify(nextState.board.bingo))
      localStorage.setItem('Desktop Bingo', JSON.stringify(nextState.board.bingo))
      localStorage.setItem('Alveus Go For Blackout', JSON.stringify(nextState.board.goForBlackout))
      localStorage.setItem('Desktop Go For Blackout', JSON.stringify(nextState.board.goForBlackout))
      return nextState
    }

    const boardType = localStorage.getItem('Board Type')
    const alveusBingo = localStorage.getItem('Alveus Bingo')
    const desktopBingo = localStorage.getItem('Desktop Bingo')
    const alveusBoard = localStorage.getItem('Alveus Board')
    const desktopBoard = localStorage.getItem('Desktop Board')
    const alveusGoForBlackout = localStorage.getItem('Alveus Go For Blackout')
    const desktopGoForBlackout = localStorage.getItem('Desktop Go For Blackout')

    switch (action.type) {
      case INIT: //if the page is refreshed
        if (boardType) {
          nextState.board.type = JSON.parse(boardType)
          if (JSON.parse(boardType) == 'Desktop' && desktopBoard) {
            nextState.board.tiles = JSON.parse(desktopBoard)
            if(desktopBingo)
              nextState.board.bingo = JSON.parse(desktopBingo)
            if(desktopGoForBlackout)
              nextState.board.goForBlackout = JSON.parse(desktopGoForBlackout)
            // page colors for desktop stream
            document.documentElement.style.setProperty('--primary-color', '#ff9bd7')
            document.documentElement.style.setProperty('--secondary-color', '#fff6fe')
            document.documentElement.style.setProperty('--tertiary-color', '#ffd1ed')
            document.documentElement.style.setProperty('--hover-color', '#fbdcf8')
          } else if (JSON.parse(boardType) == 'Alveus' && alveusBoard) {
            if(alveusBingo)
              nextState.board.bingo = JSON.parse(alveusBingo)
            if(alveusGoForBlackout)
              nextState.board.goForBlackout = JSON.parse(alveusGoForBlackout)
            nextState.board.tiles = JSON.parse(alveusBoard)
          }
        }
        break

      case '[Board] Add Chip':
      case '[Board] Remove Chip':
      case '[Board] New Game':
        if (boardType) {
          // save state depending on board type
          if (JSON.parse(boardType) == 'Alveus') {
            if (alveusBoard)
              nextState = { ...JSON.parse(alveusBoard), ...nextState }
            localStorage.setItem('Alveus Board', JSON.stringify(nextState.board.tiles))
            localStorage.setItem('Alveus Go For Blackout', JSON.stringify(nextState.board.goForBlackout))
            localStorage.setItem('Alveus Bingo', JSON.stringify(nextState.board.bingo))
          } else if (JSON.parse(boardType) == 'Desktop') {
            if (desktopBoard)
              nextState = { ...JSON.parse(desktopBoard), ...nextState }
            localStorage.setItem('Desktop Board', JSON.stringify(nextState.board.tiles))
            localStorage.setItem('Desktop Go For Blackout', JSON.stringify(nextState.board.goForBlackout))
            localStorage.setItem('Desktop Bingo', JSON.stringify(nextState.board.bingo))
          }
        }
        break

      case '[Board] Switch Stream':
        if (boardType) {
          if (JSON.parse(boardType) == 'Desktop') {
            if(alveusBingo)
              nextState.board.bingo = JSON.parse(alveusBingo)
            if(alveusGoForBlackout)
              nextState.board.goForBlackout = JSON.parse(alveusGoForBlackout)
            if (alveusBoard)
              nextState.board.tiles = JSON.parse(alveusBoard)
            else
              localStorage.setItem('Alveus Board', JSON.stringify(nextState.board.tiles))
            localStorage.setItem('Board Type', JSON.stringify('Alveus'))
          } else if (JSON.parse(boardType) == 'Alveus') {
            if(desktopBingo)
              nextState.board.bingo = JSON.parse(desktopBingo)
            if(desktopGoForBlackout)
              nextState.board.goForBlackout = JSON.parse(desktopGoForBlackout)
            if (desktopBoard)
              nextState.board.tiles = JSON.parse(desktopBoard)
            else {
              nextState.board.tiles = nextState.board.tiles.sort(() => Math.random() - 0.5)// shuffle the board
              localStorage.setItem('Desktop Board', JSON.stringify(nextState.board.tiles))
            }
            localStorage.setItem('Board Type', JSON.stringify('Desktop'))
          }
        }
        break
        case '[Board] Go For Blackout':
          if (boardType) {
            if (JSON.parse(boardType) == 'Alveus') 
                localStorage.setItem(JSON.parse(boardType)+' Go For Blackout', JSON.stringify(nextState.board.goForBlackout))
          }
          break
        case '[Board] Bingo':
          if (boardType) 
              localStorage.setItem(JSON.parse(boardType)+' Bingo', JSON.stringify(nextState.board.bingo))
    }
    return nextState
  }
}

export const metaReducers: MetaReducer<any>[] = [storageMetaReducer];

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
    ChipComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ board: boardReducer }, { metaReducers }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
