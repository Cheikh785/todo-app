import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonListComponent} from "./components/person-list/person-list.component";
import {TodoListComponent} from "./components/todo-list/todo-list.component";


const routes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full' },
  { path: 'persons', component: PersonListComponent },
  { path: 'todos', component: TodoListComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
