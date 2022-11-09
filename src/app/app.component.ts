import { Component } from '@angular/core';
import { Entry } from './entry.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spotify-streaming-history-viewer';
  history: { [id: string]: Entry[]} = {};
  historyLoaded = false;

  setHistory(historyPromise: Promise<{ [id: string]: Entry[]}>) {
    historyPromise.then((history) => {
      this.history = history;
      this.historyLoaded = true;
    });
  }
}
