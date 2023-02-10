import { Component, OnInit } from '@angular/core';
import  packageJson from '../../package.json';
import { RouterOutlet } from '@angular/router';
import { FacadeService } from './services/facade.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})

export class AppComponent implements OnInit {
  title = 'TasksManager';
  currentTheme: string = "";
  version: string = packageJson.version;

  constructor(private facadeService: FacadeService) {
    this.facadeService.loadColorScheme();
  }

  ngOnInit() {
    this.currentTheme = this.facadeService.currentActiveColorScheme();
  }
}
