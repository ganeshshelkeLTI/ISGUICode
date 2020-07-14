import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMailComponent } from './support-mail.component';

describe('SupportMailComponent', () => {
  let component: SupportMailComponent;
  let fixture: ComponentFixture<SupportMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
