import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninButtonComponent } from './google-signin-button.component';

describe('GoogleSigninButtonComponent', () => {
  let component: GoogleSigninButtonComponent;
  let fixture: ComponentFixture<GoogleSigninButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleSigninButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleSigninButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
