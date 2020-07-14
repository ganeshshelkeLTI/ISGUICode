import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataTowersComponent } from './enter-my-data-towers.component';

describe('EnterMyDataTowersComponent', () => {
  let component: EnterMyDataTowersComponent;
  let fixture: ComponentFixture<EnterMyDataTowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataTowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataTowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
