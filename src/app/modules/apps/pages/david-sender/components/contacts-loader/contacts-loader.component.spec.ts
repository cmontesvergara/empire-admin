import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsLoaderComponent } from './contacts-loader.component';

describe('ContactsLoaderComponent', () => {
  let component: ContactsLoaderComponent;
  let fixture: ComponentFixture<ContactsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
