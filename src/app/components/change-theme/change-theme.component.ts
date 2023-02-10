import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-change-theme',
    templateUrl: './change-theme.component.html',
    styleUrls: ['./change-theme.component.scss'],
    standalone: true
})
export class ChangeThemeComponent implements OnInit {
  currentTheme: string = "";
  @Output() themeChange = new EventEmitter<string>();

  constructor(public facadeService: FacadeService) { }

  ngOnInit(): void {
    this.currentTheme = this.facadeService.currentActiveColorScheme();
  }

  darkModeToggle() {
    let theme = this.facadeService.currentActiveColorScheme();
    this.facadeService.updateColorScheme(theme == 'light' ? 'dark' : 'light');
    this.themeChange.emit(theme == 'light' ? 'dark' : 'light');
  }

}
