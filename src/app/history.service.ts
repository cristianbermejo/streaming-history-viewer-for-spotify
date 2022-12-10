import { Injectable } from '@angular/core';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  entries: { [id: string]: Entry[] };
  itemsPerPage = 100;
  filesLoaded = 0;

  constructor() {
    this.entries = {};
  }

  getEntries(page: number = 0): Promise<{ [id:string]: Entry[] }> {
    return new Promise((resolve) => {
      let pagedEntries: { [id:string]: Entry[] } = {};

      let keys = Object.keys(this.entries);
      let startingItemCount = this.itemsPerPage * page;
      let endingItemCount = startingItemCount + this.itemsPerPage;
      let itemCount = 0;

      loop: for (let i = 0; i < keys.length; i++) {
        pagedEntries[keys[i]] = [];

        for (let j = 0; j < this.entries[keys[i]].length; j++) {
          if (itemCount >= startingItemCount && itemCount < endingItemCount) {
            pagedEntries[keys[i]].push(this.entries[keys[i]][j]);
          } else if (itemCount >= endingItemCount) {
            break loop;
          }

          ++itemCount;
        }
      }

      resolve(pagedEntries);
    });
  }

  setEntries(files: File[]): Promise<boolean> {
    let promises: Promise<Entry[]>[] = [];
    let readers: FileReader[] = [];

    for (let i = 0; i < files.length; i++) {
      readers[i] = new FileReader();

      promises[i] = new Promise(resolve => {
        readers[i].onload = (event: any) => {
          resolve(JSON.parse(event.target.result) as Entry[]);
        }

        readers[i].readAsText(files[i]);
      });
    }

    return Promise.all(promises).then(results => {
      // Convert the result to a single array
      results.flat()
      // Sort results by date, from latest to oldest
      .sort((a: Entry, b: Entry) => a.ts < b.ts ? 0 : -1)
      // Add each entry to the entries dictionary, using the date as the key
      .forEach(result => {
        let key = result.ts.substring(0, result.ts.indexOf("T"));
        if (!this.entries[key]) {
          this.entries[key] = [];
        }

        this.entries[key].push(result);
      });

      return true;
    });
  }
}
