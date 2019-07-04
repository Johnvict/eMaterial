import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPage } from './extra.page';

describe('ExtraPage', () => {
  let component: ExtraPage;
  let fixture: ComponentFixture<ExtraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
