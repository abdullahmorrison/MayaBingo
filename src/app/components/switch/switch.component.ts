import { map } from 'rxjs/operators';
import { Board } from '../../../store/board/board.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import{GoogleAnalyticsService} from '../../services/google-analytics.service';
import * as BoardActions from '../../../store/board/board.actions';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  switch$: Observable<string>
  googleAnalyticsService: GoogleAnalyticsService;

  constructor(private store: Store<{ board: Board }>) {
    this.switch$ = this.store.select('board').pipe(map(board => board.type))
    this.googleAnalyticsService = new GoogleAnalyticsService();

    this.switch$.subscribe((boardType) => {
      this.trackGoogleAnalytics(boardType)
    })
  }

  ngOnInit(): void { }

  handleClick(): void {
    this.swithcBoard()
  }

  trackGoogleAnalytics(boardType: string): void {
    this.googleAnalyticsService.eventEmitter("switch_board","bingo", "click", "switch_to_"+boardType)
  }
  swithcBoard(): void {
    //change the board data
    this.store.dispatch(BoardActions.switchBoard())

    //Change document colors
    let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
    if (primaryColor == '#636a60') {
      document.documentElement.style.setProperty('--primary-color', '#ff9bd7');
      document.documentElement.style.setProperty('--secondary-color', '#fff6fe');
      document.documentElement.style.setProperty('--tertiary-color', '#ffd1ed');
      document.documentElement.style.setProperty('--hover-color', '#fbdcf8');
    } else {
      document.documentElement.style.setProperty('--primary-color', '#636a60');
      document.documentElement.style.setProperty('--secondary-color', '#f9eee7');
      document.documentElement.style.setProperty('--tertiary-color', '#a8a8a8');
      document.documentElement.style.setProperty('--hover-color', '#fbe1d1');
    }
  }
}