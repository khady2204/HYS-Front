import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestionPage } from './suggestion.page';

describe('SuggestionPage', () => {
  let component: SuggestionPage;
  let fixture: ComponentFixture<SuggestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
