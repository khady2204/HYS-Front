import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationsmsPage } from './validationsms.page';

describe('ValidationsmsPage', () => {
  let component: ValidationsmsPage;
  let fixture: ComponentFixture<ValidationsmsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationsmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
