import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportPartnerPage } from './report-partner.page';

describe('ReportPartnerPage', () => {
  let component: ReportPartnerPage;
  let fixture: ComponentFixture<ReportPartnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
