import { Component, OnInit } from '@angular/core';
import { TodoService, PersonService } from '../../services';
import { Todo, Person, Priority, Label } from '../../models';
import {TodoModalComponent} from "../todo-modal/todo-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  persons: Person[] = [];
  personsMap: Map<number, Person> = new Map();

  priorities = Object.values(Priority);
  labels = Object.values(Label);

  selectedPriority: Priority | '' = '';
  selectedLabels: Label[] = [];

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
      title: {
        title: 'Titre'
      },
      personName: {
        title: 'Personne',
        valuePrepareFunction: (value: any, row: any) => {
          return this.getPersonName(row.personId);
        }
      },
      priority: {
        title: 'Priorité',
        type: 'html',
        valuePrepareFunction: (value: Priority) => {
          return this.getPriorityBadge(value);
        }
      },
      labels: {
        title: 'Labels',
        type: 'html',
        valuePrepareFunction: (labels: Label[]) => {
          return this.getLabelsBadges(labels);
        }
      },
      startDate: {
        title: 'Date de début',
        valuePrepareFunction: (date: string) => {
          return new Date(date).toLocaleDateString('fr-FR');
        }
      },
      endDate: {
        title: 'Date de fin',
        valuePrepareFunction: (date: string | null) => {
          return date ? new Date(date).toLocaleDateString('fr-FR') : 'En cours';
        }
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  constructor(
    private todoService: TodoService,
    private personService: PersonService,
    private dialog: MatDialog,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.loadPersons();
    this.loadTodos();
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
        title: {
          title: this.translocoService.translate('todo.taskTitle')
        },
        personName: {
          title: this.translocoService.translate('todo.person'),
          valuePrepareFunction: (value: any, row: any) => {
            return this.getPersonName(row.personId);
          }
        },
        priority: {
          title: this.translocoService.translate('todo.priority'),
          type: 'html',
          valuePrepareFunction: (value: Priority) => {
            return this.getPriorityBadge(value);
          }
        },
        labels: {
          title: this.translocoService.translate('todo.labels'),
          type: 'html',
          valuePrepareFunction: (labels: Label[]) => {
            return this.getLabelsBadges(labels);
          }
        },
        startDate: {
          title: this.translocoService.translate('todo.startDate'),
          valuePrepareFunction: (date: string) => {
            return new Date(date).toLocaleDateString(this.translocoService.getActiveLang());
          }
        },
        endDate: {
          title: this.translocoService.translate('todo.endDate'),
          valuePrepareFunction: (date: string | null) => {
            return date ?
              new Date(date).toLocaleDateString(this.translocoService.getActiveLang()) :
              this.translocoService.translate('todo.inProgress');
          }
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
      this.personsMap = new Map(persons.map(p => [p.id!, p]));
    });
  }

  loadTodos(): void {
    this.todoService.getAllTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilters();
    });
  }

  onAddTodo(): void {
    const dialogRef = this.dialog.open(TodoModalComponent, {
      width: '600px',
      data: { persons: this.persons }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.createTodo(result).subscribe(() => {
          this.loadTodos();
        });
      }
    });
  }

  onEditTodo(event: any): void {
    const dialogRef = this.dialog.open(TodoModalComponent, {
      width: '600px',
      data: {
        todo: event.data,
        persons: this.persons
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.updateTodo(event.data.id, result).subscribe(() => {
          this.loadTodos();
        });
      }
    });
  }

  onDeleteTodo(event: any): void {
    const confirmMessage = this.translocoService.translate('todo.deleteConfirm');
    if (confirm(confirmMessage)) {
      this.todoService.deleteTodo(event.data.id).subscribe(() => {
        this.loadTodos();
      });
    }
  }

  getPersonName(personId: number): string {
    return this.personsMap.get(personId)?.name || 'Non assigné';
  }

  getPriorityBadge(priority: Priority): string {
    const colors: { [key in Priority]: string } = {
      [Priority.FACILE]: 'bg-green-100 text-green-800',
      [Priority.MOYEN]: 'bg-yellow-100 text-yellow-800',
      [Priority.DIFFICILE]: 'bg-red-100 text-red-800'
    };
    const translatedPriority = this.translocoService.translate(`priority.${priority}`);
    return `<span class="px-2 py-1 rounded-full text-xs font-semibold ${colors[priority]}">${translatedPriority}</span>`;
  }

  getLabelsBadges(labels: Label[]): string {
    return labels.map(label => {
      const translatedLabel = this.translocoService.translate(`label.${label}`);
      return `<span class="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mr-1">${translatedLabel}</span>`;
    }).join('');
  }

  applyFilters(): void {
    this.filteredTodos = this.todos.filter(todo => {
      const matchesPriority = !this.selectedPriority || todo.priority === this.selectedPriority;

      const matchesLabels = this.selectedLabels.length === 0 ||
        this.selectedLabels.every(label => todo.labels.includes(label));

      return matchesPriority && matchesLabels;
    });
  }

  onPriorityFilterChange(): void {
    this.applyFilters();
  }

  onLabelsFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedPriority = '';
    this.selectedLabels = [];
    this.applyFilters();
  }
}
