import { TestBed } from '@angular/core/testing';

import { ResolveIdService } from './resolve-id.service';

describe('ResolveIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResolveIdService = TestBed.get(ResolveIdService);
    expect(service).toBeTruthy();
  });
});
