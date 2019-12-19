import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveProjectComponent } from './live-project.component';

describe('LiveProjectComponent', () => {
  let component: LiveProjectComponent;
  let fixture: ComponentFixture<LiveProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
