import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedStringDialogComponent } from './formatted-string-dialog.component';

describe('FormattedStringDialogComponent', () => {
  let component: FormattedStringDialogComponent;
  let fixture: ComponentFixture<FormattedStringDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormattedStringDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormattedStringDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
