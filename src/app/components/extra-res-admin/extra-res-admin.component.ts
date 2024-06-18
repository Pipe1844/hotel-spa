import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule, } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SelectionModel } from '@angular/cdk/collections';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.services';
import { ExtraResService } from '../../services/ExtraRes.service';
import { User } from '../../models/user';
import { ExtraRes } from '../../models/ExtraRes';

@Component({
  selector: 'app-extra-res-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
    MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
    RouterLink, RouterOutlet
  ],
  templateUrl: './extra-res-admin.component.html',
  styleUrl: './extra-res-admin.component.css',
  providers: [UserService, ExtraResService]
})
export class ExtraResAdminComponent {
  private checkAutorization;
  public user: User;
  public identity: any;
  public extraRes: ExtraRes;
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'idUser', 'idExtra', 'fechaServicio', 'duracion', 'total'];
  dataSource = new MatTableDataSource<ExtraRes>([]);
  selection = new SelectionModel<ExtraRes>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private extraResService: ExtraResService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.extraRes = new ExtraRes(1, 1, 1, "", 0, 0);
    this.index();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ExtraRes): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.extraResService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['data'];
        console.log(this.dataSource.data);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  createRow() {
    this.extraResService.create(this.extraRes).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: Error) => {
        console.log(err);
      },
      complete: () => {
        this.index();
        this.selection.clear();
      }
    })
  }

  updateRow() {
    this.extraResService.update(this.extraRes).subscribe({
      next: (response: any) => {
        console.log(response);

      },
      error: (err: Error) => {
        console.log(err);
        this.index();
        this.selection.clear();
      },
      complete: () => {
        this.index();
        this.selection.clear();
      }
    });
  }

  deleteSelected() {
    this.selection.selected.forEach(extraRes => {
      this.extraResService.delete(extraRes.id).subscribe({
        next: (response: any) => {
          console.log('Eliminado: ' + extraRes.id);
        },
        error: (err: Error) => {
          console.log(err);
        },
        complete: () => {
          this.index();
          this.selection.clear();
        }
      })
    });
  }

  /****************************************************************Demás métodos******************************************************************************************************/
  public formatDate(event: Event): string {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    return `${fecha.getFullYear()}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${('0' + fecha.getDate()).slice(-2)}`;
  }

  resetObject() {
    this.extraRes = new ExtraRes(1, null!, null!, "", null!, null!);
  }

  /****************************************************************Métodos Dialog******************************************************************************************************/

  setValueOfObject() {
    this.extraRes = this.selection.selected[0];
  }

  resetTable() {
    this.index();
    this.selection.clear();
  }
}
