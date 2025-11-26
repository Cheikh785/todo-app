import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Person, Todo, Priority, Label } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportPersonsToExcel(persons: Person[], filename: string = 'persons'): void {
    const worksheet = XLSX.utils.json_to_sheet(persons.map(person => ({
      'Nom': person.name,
      'Email': person.email,
      'Téléphone': person.phone
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Personnes');

    worksheet['!cols'] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 20 }
    ];

    XLSX.writeFile(workbook, `${filename}_${this.getFormattedDate()}.xlsx`);
  }

  exportTodosToExcel(todos: Todo[], personsMap: Map<number, Person>, filename: string = 'todos'): void {
    const worksheet = XLSX.utils.json_to_sheet(todos.map(todo => ({
      'Titre': todo.title,
      'Personne': personsMap.get(todo.personId)?.name || 'Non assigné',
      'Priorité': todo.priority,
      'Labels': todo.labels.join(', '),
      'Date début': this.formatDate(todo.startDate),
      'Date fin': todo.endDate ? this.formatDate(todo.endDate) : 'En cours',
      'Description': todo.description
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tâches');

    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 12 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 40 }
    ];

    XLSX.writeFile(workbook, `${filename}_${this.getFormattedDate()}.xlsx`);
  }

  exportPersonsToPDF(persons: Person[], filename: string = 'persons'): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Liste des Personnes', 14, 22);

    doc.setFontSize(10);
    doc.text(`Date d'export: ${this.getFormattedDateTime()}`, 14, 30);

    const tableData = persons.map(person => [
      person.name,
      person.email,
      person.phone
    ]);

    autoTable(doc, {
      head: [['Nom', 'Email', 'Téléphone']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`${filename}_${this.getFormattedDate()}.pdf`);
  }

  exportTodosToPDF(todos: Todo[], personsMap: Map<number, Person>, filename: string = 'todos'): void {
    const doc = new jsPDF('l');

    doc.setFontSize(18);
    doc.text('Liste des Tâches', 14, 22);

    doc.setFontSize(10);
    doc.text(`Date d'export: ${this.getFormattedDateTime()}`, 14, 30);

    const tableData = todos.map(todo => [
      todo.title,
      personsMap.get(todo.personId)?.name || 'Non assigné',
      todo.priority,
      todo.labels.join(', '),
      this.formatDate(todo.startDate),
      todo.endDate ? this.formatDate(todo.endDate) : 'En cours',
      todo.description.length > 50 ? todo.description.substring(0, 50) + '...' : todo.description
    ]);

    autoTable(doc, {
      head: [['Titre', 'Personne', 'Priorité', 'Labels', 'Début', 'Fin', 'Description']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 60 }
      }
    });

    doc.save(`${filename}_${this.getFormattedDate()}.pdf`);
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  private getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private getFormattedDateTime(): string {
    const now = new Date();
    return now.toLocaleString('fr-FR');
  }
}
