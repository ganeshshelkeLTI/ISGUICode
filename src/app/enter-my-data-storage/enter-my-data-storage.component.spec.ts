import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMyDataStorageComponent } from './enter-my-data-storage.component';

describe('EnterMyDataStorageComponent', () => {
  let component: EnterMyDataStorageComponent;
  let fixture: ComponentFixture<EnterMyDataStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMyDataStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMyDataStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
