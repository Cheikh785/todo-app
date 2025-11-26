import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Ng2SmartTableModule} from "ng2-smart-table";
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import {MaterialModule} from "./shared/material.module";
import { LayoutComponent } from './components/layout/layout.component';
import {TodoListComponent} from "./components/todo-list/todo-list.component";
import {TodoModalComponent} from "./components/todo-modal/todo-modal.component";
import {PersonListComponent} from "./components/person-list/person-list.component";
import {TranslocoRootModule} from "./transloco-root.module";
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    AppComponent,
    PersonListComponent,
    PersonModalComponent,
    TodoListComponent,
    TodoModalComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslocoRootModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
