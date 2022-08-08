import { TestBed } from '@angular/core/testing';

import { AuthconnexionGuard } from './authconnexion.guard';

describe('AuthconnexionGuard', () => {
  let guard: AuthconnexionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthconnexionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
