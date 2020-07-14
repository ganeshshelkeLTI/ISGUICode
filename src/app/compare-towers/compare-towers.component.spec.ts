import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareTowersComponent } from './compare-towers.component';

describe('CompareTowersComponent', () => {
  let component: CompareTowersComponent;
  let fixture: ComponentFixture<CompareTowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareTowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareTowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
