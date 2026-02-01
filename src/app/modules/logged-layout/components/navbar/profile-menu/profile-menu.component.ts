import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AvatarModule } from 'ngx-avatars';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ThemeService } from '../../../../../core/services/theme/theme.service';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [
    ClickOutsideDirective,
    NgClass,
    RouterLink,
    AngularSvgIconModule,
    AvatarModule,
    TitleCasePipe,
  ],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Perfil',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/dashboard/profile',
    },
    // {
    //   title: 'Configuración',
    //   icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
    //   link: '/settings',
    // },
    {
      title: 'Cerrar sesión',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth/sign-out',
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#3b82f6', // if change this color, change it in ./styles.scss, --primary variable
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];
  userInformation: any = undefined;

  constructor(
    public themeService: ThemeService,
    private readonly authService: AuthService,
  ) {
    this.authService.getProfile().subscribe((res) => {
      if (res && res.user) {
        this.userInformation = {
          name: `${res.user.firstName} ${res.user.lastName}`,
          email: res.user.email,
        };
      }
    });
  }

  ngOnInit(): void { }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
}
