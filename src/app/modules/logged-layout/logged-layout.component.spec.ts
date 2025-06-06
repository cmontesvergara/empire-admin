import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedLayoutComponent } from './logged-layout.component';

describe('LoggedLayoutComponent', () => {
  let component: LoggedLayoutComponent;
  let fixture: ComponentFixture<LoggedLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
