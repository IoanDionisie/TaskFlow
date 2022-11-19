import { TestBed } from '@angular/core/testing';

import { ColorschemeService } from './colorscheme.service';

describe('ColorschemeService', () => {
  let service: ColorschemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorschemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
