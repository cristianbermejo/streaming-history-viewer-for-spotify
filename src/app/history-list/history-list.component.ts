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

  constructor() {
  }

  ngOnInit(): void {
  }

}
