import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonService } from '../../services';
import { Person } from '../../models';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.css']
})
export class PersonModalComponent implements OnInit {
  personForm: FormGroup;
  isEditMode: boolean = false;
  modalTitle: string = 'Ajouter une personne';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    public dialogRef: MatDialogRef<PersonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person?: Person, allPersons: Person[] }
  ) {
    this.isEditMode = !!data.person;
    this.modalTitle = this.isEditMode ? 'Modifier une personne' : 'Ajouter une personne';

    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), this.trimValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.person) {
      this.personForm.patchValue(this.data.person);
    }

    this.personForm.get('name')?.addAsyncValidators(
      this.uniqueNameValidator.bind(this)
    );
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

  uniqueNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    const trimmedName = control.value.trim();
    const currentPersonId = this.data.person?.id;

    const isDuplicate = this.data.allPersons.some(person =>
      person.name.toLowerCase() === trimmedName.toLowerCase() &&
      person.id !== currentPersonId
    );

    if (isDuplicate) {
      return of({ uniqueName: true });
    }

    return of(null);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }

    if (field?.hasError('minlength')) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    }

    if (field?.hasError('minLengthAfterTrim')) {
      return 'Le nom doit contenir au moins 3 caractères (espaces non comptés)';
    }

    if (field?.hasError('email')) {
      return 'Email invalide';
    }

    if (field?.hasError('uniqueName')) {
      return 'Ce nom existe déjà';
    }

    return '';
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const formValue = {
        ...this.personForm.value,
        name: this.personForm.value.name.trim()
      };

      this.dialogRef.close(formValue);
    } else {
      Object.keys(this.personForm.controls).forEach(key => {
        this.personForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
