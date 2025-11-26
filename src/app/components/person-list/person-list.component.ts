import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services';
import { Person } from '../../models';
import {PersonModalComponent} from "../person-modal/person-modal.component";
import {MatDialog} from "@angular/material/dialog";
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  filteredPersons: Person[] = [];

  settings = {
    mode: 'external',
    actions: {
      columnTitle: 'Actions',
      add: false,
      position: 'right'
    },
    edit: {
      editButtonContent: '<i class="material-icons">edit</i>',
    },
    delete: {
      deleteButtonContent: '<i class="material-icons">delete</i>',
      confirmDelete: true
    },
    columns: {
      name: {
        title: 'Nom'
      },
      email: {
        title: 'Email'
      },
      phone: {
        title: 'Téléphone'
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  nameFilter: string = '';
  emailFilter: string = '';

  constructor(private personService: PersonService, private dialog: MatDialog, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.loadPersons();
    this.updateTableSettings();

    this.translocoService.langChanges$.subscribe(() => {
      this.updateTableSettings();
    });
  }

  updateTableSettings(): void {
    this.settings = {
      mode: 'external',
      actions: {
        columnTitle: this.translocoService.translate('common.actions'),
        add: false,
        position: 'right'
      },
      edit: {
        editButtonContent: '<i class="material-icons">edit</i>',
      },
      delete: {
        deleteButtonContent: '<i class="material-icons">delete</i>',
        confirmDelete: true
      },
      columns: {
        name: {
          title: this.translocoService.translate('person.name')
        },
        email: {
          title: this.translocoService.translate('person.email')
        },
        phone: {
          title: this.translocoService.translate('person.phone')
        }
      },
      pager: {
        display: true,
        perPage: 10
      }
    };
  }

  loadPersons(): void {
    this.personService.getAllPersons().subscribe(persons => {
      this.persons = persons;
      this.applyFilters();
    });
  }

  onAddPerson(): void {
    const dialogRef = this.dialog.open(PersonModalComponent, {
      width: '500px',
      data: { allPersons: this.persons }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.createPerson(result).subscribe(() => {
          this.loadPersons();
        });
      }
    });
  }

  onEditPerson(event: any): void {
    const dialogRef = this.dialog.open(PersonModalComponent, {
      width: '500px',
      data: {
        person: event.data,
        allPersons: this.persons
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.updatePerson(event.data.id, result).subscribe(() => {
          this.loadPersons();
        });
      }
    });
  }

  onDeletePerson(event: any): void {
    const confirmMessage = this.translocoService.translate('person.deleteConfirm');
    if (confirm(confirmMessage)) {
      this.personService.deletePerson(event.data.id).subscribe(() => {
        this.loadPersons();
      });
    }
  }

  applyFilters(): void {
    this.filteredPersons = this.persons.filter(person => {
      const matchesName = !this.nameFilter ||
        person.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const matchesEmail = !this.emailFilter ||
        person.email.toLowerCase().includes(this.emailFilter.toLowerCase());

      return matchesName && matchesEmail;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.emailFilter = '';
    this.applyFilters();
  }
}
