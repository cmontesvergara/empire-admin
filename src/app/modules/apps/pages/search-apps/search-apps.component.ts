import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-apps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-apps.component.html',
  styleUrl: './search-apps.component.scss',
})
export class SearchAppsComponent {
  searchQuery = '';
  primaryColor = '#6366f1'; // Indigo
  mode:  'standalone' | 'embedded' = 'embedded';

  apps = [
    {
      name: 'Css Unit Changer',
      category: 'Productividad',
      icon: '🔧',
      description: 'Herramienta profesional de diseño vectorial',
      link: '/apps/css-unit-changer',
    },
    {
      name: 'File Renamer',
      category: 'Productividad',
      iconLink: 'assets/icons/heroicons/outline/code-bracket.svg',
      description: 'Herramienta profesional de diseño vectorial',
      link: '/apps/file-renamer',
    },
  ];
  constructor(private readonly router: Router, private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'];
    });
  }

  get filteredApps() {
    if (!this.searchQuery) return this.apps;
    const query = this.searchQuery.toLowerCase();
    return this.apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query),
    );
  }
  goToApp(link: string) {
    this.router.navigateByUrl(link);
  }
}
