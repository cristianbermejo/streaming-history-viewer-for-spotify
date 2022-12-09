import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Entry } from '../entry.model';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css']
})
export class FilePickerComponent implements OnInit {
  @Output() fileOpenEvent = new EventEmitter<Promise<{ [id:string]: Entry[]}>>();

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
  }

  openFile(event: any): Promise<{ [id:string]: Entry[]}> {
    let files = event.target.files;

    if (files.length > 0) {
      this.historyService.setEntries(files);
    }

    return this.historyService.getEntries();
  }

}
