import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationSuccessPage } from './registration-success.page';

describe('RegistrationSuccessPage', () => {
  let component: RegistrationSuccessPage;
  let fixture: ComponentFixture<RegistrationSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
