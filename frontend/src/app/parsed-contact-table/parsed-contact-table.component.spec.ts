import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParsedContactTableComponent } from './parsed-contact-table.component';

describe('ParsedContactTableComponent', () => {
  let component: ParsedContactTableComponent;
  let fixture: ComponentFixture<ParsedContactTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParsedContactTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParsedContactTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
