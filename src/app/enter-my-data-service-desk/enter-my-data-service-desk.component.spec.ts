import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataServiceDeskComponent } from './enter-my-data-service-desk.component';

describe('EnterMyDataServiceDeskComponent', () => {
  let component: EnterMyDataServiceDeskComponent;
  let fixture: ComponentFixture<EnterMyDataServiceDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataServiceDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataServiceDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
