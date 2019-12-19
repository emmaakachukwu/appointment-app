import { TestBed } from '@angular/core/testing';

import { SurveyResolverService } from './survey-resolver.service';

describe('SurveyResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyResolverService = TestBed.get(SurveyResolverService);
    expect(service).toBeTruthy();
  });
});
