import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorSchemeService } from 'src/app/services/colorscheme.service';

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html',
  styleUrls: ['./change-theme.component.scss']
})
export class ChangeThemeComponent implements OnInit {
  currentTheme: string = "";
  @Output() themeChange = new EventEmitter<string>();

  constructor(public colorSchemeService: ColorSchemeService) { }

  ngOnInit(): void {
    this.currentTheme = this.colorSchemeService.currentActive();
  }

  darkModeToggle() {
    let theme = this.colorSchemeService.currentActive();
    this.colorSchemeService.update(theme == 'light' ? 'dark' : 'light');
    this.themeChange.emit(theme == 'light' ? 'dark' : 'light');
  }

}
