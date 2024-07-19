import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureButtonComponent } from './signature-button.component';

describe('SignatureButtonComponent', () => {
  let component: SignatureButtonComponent;
  let fixture: ComponentFixture<SignatureButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
