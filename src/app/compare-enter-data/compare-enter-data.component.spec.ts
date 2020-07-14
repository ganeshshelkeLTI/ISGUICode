import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareEnterDataComponent } from './compare-enter-data.component';

describe('CompareEnterDataComponent', () => {
  let component: CompareEnterDataComponent;
  let fixture: ComponentFixture<CompareEnterDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareEnterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareEnterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
