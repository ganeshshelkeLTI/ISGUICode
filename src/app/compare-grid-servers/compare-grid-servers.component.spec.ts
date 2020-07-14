import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGridServersComponent } from './compare-grid-servers.component';

describe('CompareGridServersComponent', () => {
  let component: CompareGridServersComponent;
  let fixture: ComponentFixture<CompareGridServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareGridServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGridServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
