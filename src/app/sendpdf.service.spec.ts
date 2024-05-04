import { TestBed } from '@angular/core/testing';

import { SendpdfService } from './sendpdf.service';

describe('SendpdfService', () => {
  let service: SendpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
