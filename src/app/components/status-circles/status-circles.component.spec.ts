import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCirclesComponent } from './status-circles.component';

describe('StatusCirclesComponent', () => {
  let component: StatusCirclesComponent;
  let fixture: ComponentFixture<StatusCirclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusCirclesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
