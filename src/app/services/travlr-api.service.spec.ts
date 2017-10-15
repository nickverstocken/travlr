import { TestBed, inject } from '@angular/core/testing';

import { TravlrApiService } from './travlr-api.service';

describe('TravlrApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TravlrApiService]
    });
  });

  it('should be created', inject([TravlrApiService], (service: TravlrApiService) => {
    expect(service).toBeTruthy();
  }));
});
