import { TestBed } from '@angular/core/testing';

import { InteretService } from './interet.service';

describe('InteretService', () => {
  let service: InteretService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteretService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
