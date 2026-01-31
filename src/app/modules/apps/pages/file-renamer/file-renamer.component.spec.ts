import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRenamerComponent } from './file-renamer.component';

describe('FileRenamerComponent', () => {
  let component: FileRenamerComponent;
  let fixture: ComponentFixture<FileRenamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileRenamerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileRenamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
