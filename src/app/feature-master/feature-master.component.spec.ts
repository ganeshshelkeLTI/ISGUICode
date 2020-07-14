import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureMasterComponent } from './feature-master.component';

describe('FeatureMasterComponent', () => {
  let component: FeatureMasterComponent;
  let fixture: ComponentFixture<FeatureMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
