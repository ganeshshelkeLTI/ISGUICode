import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceServicesComponent } from './workplace-services.component';

describe('WorkplaceServicesComponent', () => {
  let component: WorkplaceServicesComponent;
  let fixture: ComponentFixture<WorkplaceServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplaceServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplaceServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
