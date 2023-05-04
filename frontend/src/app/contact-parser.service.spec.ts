import { TestBed } from '@angular/core/testing';

import { ContactParserService } from './contact-parser.service';

describe('ContactParserService', () => {
  let service: ContactParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
