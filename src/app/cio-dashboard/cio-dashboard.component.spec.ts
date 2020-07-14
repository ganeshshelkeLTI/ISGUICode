import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CioDashboardComponent } from './cio-dashboard.component';

describe('CioDashboardComponent', () => {
  let component: CioDashboardComponent;
  let fixture: ComponentFixture<CioDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CioDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
