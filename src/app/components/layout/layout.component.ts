import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  isMobile = false;

  navigationItems = [
    {
      labelKey: 'navigation.persons',
      icon: 'people',
      route: '/persons'
    },
    {
      labelKey: 'navigation.todos',
      icon: 'task',
      route: '/todos'
    }
  ];

  availableLanguages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  currentLanguage: string;

  constructor(private breakpointObserver: BreakpointObserver, private translocoService: TranslocoService) {
    this.currentLanguage = this.translocoService.getActiveLang();
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.sidenavMode = this.isMobile ? 'over' : 'side';
        this.sidenavOpened = !this.isMobile;
      });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  closeSidenavIfMobile(): void {
    if (this.isMobile) {
      this.sidenavOpened = false;
    }
  }

  changeLanguage(languageCode: string): void {
    this.translocoService.setActiveLang(languageCode);
    this.currentLanguage = languageCode;
  }
}
