import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataApplicationMaintenanceComponent } from './enter-my-data-application-maintenance.component';

describe('EnterMyDataApplicationMaintenanceComponent', () => {
  let component: EnterMyDataApplicationMaintenanceComponent;
  let fixture: ComponentFixture<EnterMyDataApplicationMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataApplicationMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataApplicationMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
