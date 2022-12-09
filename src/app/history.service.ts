import { Injectable } from '@angular/core';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  entries: { [id: string]: Entry[] };

  constructor() {
    this.entries = {};
  }

  getEntries(): Promise<{ [id:string]: Entry[] }> {
    return new Promise((resolve) => {
      resolve(this.entries);
    });
  }

  setEntries(files: File[]) {
    let reader: FileReader;

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
        if (!this.entries[keys[i]]) {
          this.entries[keys[i]] = [];
        }
        
        this.entries[keys[i]] = [...this.entries[keys[i]], ...unsortedGroupedEntries[keys[i]].sort((a: Entry, b: Entry) => a.ts < b.ts ? 0 : -1)];
      }
    }

    for (let i = 0; i < files.length; i++) {
      reader = new FileReader();
      reader.onload = onload;

      reader.readAsText(files[i]);
    }
  }
}
