import { TestBed } from '@angular/core/testing';

import { UnverifiedGuard } from './unverified.guard';

describe('UnverifiedGuard', () => {
  let guard: UnverifiedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnverifiedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
