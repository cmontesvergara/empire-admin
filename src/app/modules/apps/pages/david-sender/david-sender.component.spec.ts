import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DavidSenderComponent } from './david-sender.component';

describe('DavidSenderComponent', () => {
  let component: DavidSenderComponent;
  let fixture: ComponentFixture<DavidSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DavidSenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DavidSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
