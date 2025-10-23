import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerificationPage } from './otp-verification.page';

describe('OtpVerificationPage', () => {
  let component: OtpVerificationPage;
  let fixture: ComponentFixture<OtpVerificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
