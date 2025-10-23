import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call googleLogin and return AuthResponse', () => {
    const mockResponse: AuthResponse = { token: 'jwt-token' };
    const idToken = 'google-id-token';

    service.googleLogin({ idToken }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.ApiUrl}/api/auth/google-login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ idToken });
    req.flush(mockResponse);
  });

  it('should handle googleLogin error', () => {
    const mockError: AuthResponse = { error: 'Invalid token' };
    const idToken = 'invalid-token';

    service.googleLogin({ idToken }).subscribe((res) => {
      expect(res).toEqual(mockError);
    });

    const req = httpMock.expectOne(`${service.ApiUrl}/api/auth/google-login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockError);
  });
});
