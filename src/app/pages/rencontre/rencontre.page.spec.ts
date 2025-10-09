import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RencontrePage } from './rencontre.page';

describe('RencontrePage', () => {
  let component: RencontrePage;
  let fixture: ComponentFixture<RencontrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RencontrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
