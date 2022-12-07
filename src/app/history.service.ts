import { Injectable } from '@angular/core';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  entries: Entry[];
  groupedEntries: { [id: string]: Entry[] };

  constructor() {
    this.entries = [];
    this.groupedEntries = {};
  }

  getEntries(files: File[]): Promise<Entry[]> {
    return new Promise((resolve) => {
      this.entries.splice(0);

      let onload = (event: any) => {
        let loadedEntries = JSON.parse(event.target.result) as Entry[];

        loadedEntries = loadedEntries.sort(this.sort);
    
        this.entries = [...this.entries, ...loadedEntries];
      }

      let reader;
      for (let i = 0; i < files.length; i++) {
        reader = new FileReader();
        reader.onload = onload;

        reader.readAsText(files[i]);
      }

      resolve(this.entries);
    });
  }

  getEntriesGroupedByDate(files: File[]): Promise<{ [id:string]: Entry[] }> {
    return new Promise((resolve) => {
      this.groupedEntries = {};

      let onload = (event: any) => {
        let loadedEntries = JSON.parse(event.target.result) as Entry[];
    
        // Group entries by date
        let unsortedGroupedEntries: { [id: string]: Entry[] } = {};
        let date = "";
        for (let i = 0; i < loadedEntries.length; i++) {
          date = loadedEntries[i].ts.substring(0, loadedEntries[i].ts.indexOf("T"));
    
          if (!unsortedGroupedEntries[date]) {
            unsortedGroupedEntries[date] = [];
          }
    
          unsortedGroupedEntries[date].push(loadedEntries[i]);
        }
    
        // Sort the entries also by date
        let keys = Object.keys(unsortedGroupedEntries);
        for (let i = 0; i < keys.length; i++) {
          this.groupedEntries[keys[i]] = unsortedGroupedEntries[keys[i]].sort(this.sort);
        }
      }

      let reader;
      for (let i = 0; i < files.length; i++) {
        reader = new FileReader();
        reader.onload = onload;

        reader.readAsText(files[i]);
      }

      resolve(this.groupedEntries);
    });
  }

  sort(a: Entry, b: Entry) {
    return a.ts < b.ts ? 0 : -1;
  }
}
