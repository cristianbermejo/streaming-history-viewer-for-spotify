import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../entry.model';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {
  @Input() history: { [id: string]: Entry[]} = {};
  compareDesc = (a: KeyValue<string, Entry[]>, b: KeyValue<string, Entry[]>) => a.key < b.key ? 0 : -1;

  constructor() {
  }

  ngOnInit(): void {
  }

}
