import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjouterMediaPage } from './ajouter-media.page';

describe('AjouterMediaPage', () => {
  let component: AjouterMediaPage;
  let fixture: ComponentFixture<AjouterMediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
