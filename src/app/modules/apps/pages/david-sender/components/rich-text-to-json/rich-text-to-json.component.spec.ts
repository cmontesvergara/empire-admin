import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextToJsonComponent } from './rich-text-to-json.component';

describe('RichTextToJsonComponent', () => {
  let component: RichTextToJsonComponent;
  let fixture: ComponentFixture<RichTextToJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextToJsonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichTextToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
