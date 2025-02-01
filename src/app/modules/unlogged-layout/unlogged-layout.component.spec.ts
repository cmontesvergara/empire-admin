import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloggedLayoutComponent } from './unlogged-layout.component';

describe('UnloggedLayoutComponent', () => {
  let component: UnloggedLayoutComponent;
  let fixture: ComponentFixture<UnloggedLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnloggedLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloggedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
