import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsHubComponent } from './agents-hub.component';

describe('AgentsHubComponent', () => {
  let component: AgentsHubComponent;
  let fixture: ComponentFixture<AgentsHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
