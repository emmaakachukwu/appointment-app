import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApointmentsComponent } from './view-apointments.component';

describe('ViewApointmentsComponent', () => {
  let component: ViewApointmentsComponent;
  let fixture: ComponentFixture<ViewApointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
