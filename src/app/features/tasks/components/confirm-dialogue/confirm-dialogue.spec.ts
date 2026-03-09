import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogue } from './confirm-dialogue';

describe('ConfirmDialogue', () => {
  let component: ConfirmDialogue;
  let fixture: ComponentFixture<ConfirmDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
