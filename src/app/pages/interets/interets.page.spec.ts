import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteretsPage } from './interets.page';

describe('InteretsPage', () => {
  let component: InteretsPage;
  let fixture: ComponentFixture<InteretsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InteretsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
