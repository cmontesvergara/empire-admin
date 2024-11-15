import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssUnitChangerComponent } from './css-unit-changer.component';

describe('CssUnitChangerComponent', () => {
  let component: CssUnitChangerComponent;
  let fixture: ComponentFixture<CssUnitChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CssUnitChangerComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CssUnitChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
