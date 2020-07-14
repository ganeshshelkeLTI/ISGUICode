import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverNoteComponent } from './popover-note.component';

describe('PopoverNoteComponent', () => {
  let component: PopoverNoteComponent;
  let fixture: ComponentFixture<PopoverNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
