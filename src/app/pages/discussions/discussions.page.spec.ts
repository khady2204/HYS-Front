import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscussionsPage } from './discussions.page';

describe('DiscussionsPage', () => {
  let component: DiscussionsPage;
  let fixture: ComponentFixture<DiscussionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
