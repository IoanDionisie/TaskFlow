import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from './services/colorscheme.service';
import  packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'TasksManager';
  currentTheme: string = "";
  version: string = packageJson.version;

  constructor(private colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.load();
  }

  ngOnInit() {
    this.currentTheme = this.colorSchemeService.currentActive();
  }
}
