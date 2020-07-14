import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomrefenceGroupUserMappingComponent } from './customrefence-group-user-mapping.component';

describe('CustomrefenceGroupUserMappingComponent', () => {
  let component: CustomrefenceGroupUserMappingComponent;
  let fixture: ComponentFixture<CustomrefenceGroupUserMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomrefenceGroupUserMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomrefenceGroupUserMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
