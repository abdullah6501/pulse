import { TestBed } from '@angular/core/testing';

import { GenemailService } from './genemail.service';

describe('GenemailService', () => {
  let service: GenemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
