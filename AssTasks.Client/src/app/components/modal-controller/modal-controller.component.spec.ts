import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalControllerComponent } from './modal-controller.component';

describe('ModalControllerComponent', () => {
  let component: ModalControllerComponent;
  let fixture: ComponentFixture<ModalControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
