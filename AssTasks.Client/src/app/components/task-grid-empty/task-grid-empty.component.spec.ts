import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGridEmptyComponent } from './task-grid-empty.component';

describe('TaskGridEmptyComponent', () => {
  let component: TaskGridEmptyComponent;
  let fixture: ComponentFixture<TaskGridEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskGridEmptyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskGridEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
