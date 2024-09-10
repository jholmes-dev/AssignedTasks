import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTasksModalComponent } from './manage-tasks-modal.component';

describe('ManageTasksModalComponent', () => {
  let component: ManageTasksModalComponent;
  let fixture: ComponentFixture<ManageTasksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTasksModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
