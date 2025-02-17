import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePersonalInformationComponent } from './profile-personal-information.component';

describe('ProfileSidebarComponent', () => {
  let component: ProfilePersonalInformationComponent;
  let fixture: ComponentFixture<ProfilePersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProfilePersonalInformationComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
