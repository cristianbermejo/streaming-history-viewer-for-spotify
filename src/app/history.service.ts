import { Injectable } from '@angular/core';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  reader = new FileReader();

  constructor() { }

  getEntries(file: File): Promise<Entry[]> {
    return new Promise((resolve) => {
      this.reader.onload = (event: any) => {
        let entries = JSON.parse(event.target.result) as Entry[];

        resolve(entries.sort((a: Entry, b: Entry) => {
          return a.ts < b.ts ? 0 : -1;
        }));
      }
      this.reader.readAsText(file);
    });
  }

  getEntriesGroupedByDate(file: File): Promise<{ [id:string]: Entry[] }> {
    return new Promise((resolve) => {
      this.reader.onload = (event: any) => {
        let entries = JSON.parse(event.target.result) as Entry[];

        // Group entries by date
        let groupedEntries: { [id: string]: Entry[] } = {};
        let date = "";
        for (let i = 0; i < entries.length; i++) {
          date = entries[i].ts.substring(0, entries[i].ts.indexOf("T"));

          if (!groupedEntries[date]) {
            groupedEntries[date] = [];
          }

          groupedEntries[date].push(entries[i]);
        }

        // Sort the entries also by date
        let keys = Object.keys(groupedEntries);
        let sortedEntries: { [id: string]: Entry[] } = {};
        for (let i = 0; i < keys.length; i++) {
          sortedEntries[keys[i]] = groupedEntries[keys[i]].sort((a: Entry, b: Entry) => {
            return a.ts < b.ts ? 0 : -1;
          });
        }

        console.log(sortedEntries);
        resolve(sortedEntries);
      }
      
      this.reader.readAsText(file);
    });
  }
}
