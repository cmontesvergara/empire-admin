import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAppsComponent } from './search-apps.component';

describe('SearchAppsComponent', () => {
  let component: SearchAppsComponent;
  let fixture: ComponentFixture<SearchAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAppsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
