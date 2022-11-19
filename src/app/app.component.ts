import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from './services/colorscheme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TasksManager';
  currentTheme: string = "";

  constructor(private colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.load();
  }

  ngOnInit() {
    this.currentTheme = this.colorSchemeService.currentActive();
  }
}
