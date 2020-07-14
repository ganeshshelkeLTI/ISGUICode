import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridStorageComponent } from './compare-grid-storage.component';

describe('CompareGridStorageComponent', () => {
  let component: CompareGridStorageComponent;
  let fixture: ComponentFixture<CompareGridStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
