import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkBreakComponent } from './work-break.component';

describe('WorkBreakComponent', () => {
  let component: WorkBreakComponent;
  let fixture: ComponentFixture<WorkBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkBreakComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
