import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PersonService } from '../../services';
import { Todo, Person, Priority, Label } from '../../models';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-todo-modal',
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.css']
})
export class TodoModalComponent implements OnInit {
  todoForm: FormGroup;
  isEditMode: boolean = false;
  modalTitle: string = '';

  persons: Person[] = [];
  filteredPersons!: Observable<Person[]>;

  priorities = Object.values(Priority);
  labels = Object.values(Label);

  isCompleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private translocoService: TranslocoService,
    public dialogRef: MatDialogRef<TodoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo?: Todo, persons: Person[] }
  ) {
    this.isEditMode = !!data.todo;
    this.modalTitle = this.isEditMode ?
      this.translocoService.translate('todo.editTodo') :
      this.translocoService.translate('todo.addTodo');
    this.persons = data.persons;

    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), this.trimValidator]],
      person: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: [{ value: null, disabled: false }],
      priority: ['', Validators.required],
      labels: [[], Validators.required],
      description: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.todo) {
      const person = this.persons.find(p => p.id === this.data.todo!.personId);

      this.todoForm.patchValue({
        title: this.data.todo.title,
        person: person,
        startDate: this.data.todo.startDate,
        endDate: this.data.todo.endDate,
        priority: this.data.todo.priority,
        labels: this.data.todo.labels,
        description: this.data.todo.description,
        completed: !!this.data.todo.endDate
      });

      this.isCompleted = !!this.data.todo.endDate;
      if (this.isCompleted) {
        this.todoForm.get('endDate')?.disable();
      }
    }

    this.filteredPersons = this.todoForm.get('person')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterPersons(name as string) : this.persons.slice();
      })
    );

    this.todoForm.get('completed')?.valueChanges.subscribe(completed => {
      this.onCompletedChange(completed);
    });
  }

  private _filterPersons(value: string): Person[] {
    const filterValue = value.toLowerCase();
    return this.persons.filter(person =>
      person.name.toLowerCase().includes(filterValue)
    );
  }

  displayPerson(person: Person): string {
    return person?.name || '';
  }

  trimValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const trimmedValue = control.value.trim();
    if (trimmedValue.length < 3) {
      return { minLengthAfterTrim: { requiredLength: 3, actualLength: trimmedValue.length } };
    }
    return null;
  }

  onCompletedChange(completed: boolean): void {
    this.isCompleted = completed;
    const endDateControl = this.todoForm.get('endDate');

    if (completed) {
      const now = new Date().toISOString().split('T')[0];
      endDateControl?.setValue(now);
      endDateControl?.disable();
    } else {
      endDateControl?.setValue(null);
      endDateControl?.enable();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.todoForm.get(fieldName);

    if (field?.hasError('required')) {
      return this.translocoService.translate('validation.required');
    }

    if (field?.hasError('minlength')) {
      return this.translocoService.translate('validation.minLength', {
        length: field.errors?.['minlength'].requiredLength
      });
    }

    if (field?.hasError('minLengthAfterTrim')) {
      return this.translocoService.translate('validation.minLengthTrim', { length: 3 });
    }

    return '';
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.getRawValue();

      const todo: Todo = {
        title: formValue.title.trim(),
        personId: formValue.person.id,
        startDate: formValue.startDate,
        endDate: formValue.endDate || null,
        priority: formValue.priority,
        labels: formValue.labels,
        description: formValue.description
      };

      this.dialogRef.close(todo);
    } else {
      Object.keys(this.todoForm.controls).forEach(key => {
        this.todoForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
