import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopNoteComponent } from './pop-note.component';

describe('PopNoteComponent', () => {
  let component: PopNoteComponent;
  let fixture: ComponentFixture<PopNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
