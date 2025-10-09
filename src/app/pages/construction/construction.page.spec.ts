import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructionPage } from './construction.page';

describe('ConstructionPage', () => {
  let component: ConstructionPage;
  let fixture: ComponentFixture<ConstructionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
