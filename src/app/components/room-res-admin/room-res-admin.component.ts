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
import { RouterLink, RouterOutlet, Router  } from '@angular/router';
import { UserService } from '../../services/user.services';
import { RoomResService } from '../../services/RoomRes.service';
import { User } from '../../models/user';
import { RoomRes } from '../../models/RoomRes';

@Component({
  selector: 'app-room-res-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
    MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
    RouterLink, RouterOutlet
  ],
  templateUrl: './room-res-admin.component.html',
  styleUrl: './room-res-admin.component.css',
  providers: [UserService, RoomResService]
})
export class RoomResAdminComponent {
  // private checkAutorization;
  public user: User;
  public identity: any;
  public roomRes: RoomRes;
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'idUser', 'idRoom', 'total', 'fechaEntrada', 'fechaSalida'];
  dataSource = new MatTableDataSource<RoomRes>([]);
  selection = new SelectionModel<RoomRes>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, 
    private roomResService: RoomResService, 
    private router: Router) 
    {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    // this.checkAutorization = setInterval(() => {
    //   this.getAuth();
    // }, 5000)
    this.roomRes = new RoomRes(1, 1, 1, 0, "", "");
    this.index();
  }

  getAuth() {
    this.userService.getAuthTokenFromAPI().subscribe({
      next: (response: any) => {
        if (response) {
          this.identity = this.userService.getIdentityFromStorage();
        } else {
          sessionStorage.clear();
          console.log("Sesión borrada");
          this.router.navigate(['']);
        }
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
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
  checkboxLabel(row?: RoomRes): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.roomResService.index().subscribe({
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
    if (this.roomRes.fechaEntrada == this.roomRes.fechaSalida) {
      console.log("La fecha de entrada y de salida no pueden ser las mismas");
      this.index();
      this.selection.clear();
    } else {
      this.roomResService.create(this.roomRes).subscribe({
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
  }

  updateRow() {
    if (this.roomRes.fechaEntrada == this.roomRes.fechaSalida) {
      console.log("La fecha de entrada y de salida no pueden ser las mismas");
      this.index();
      this.selection.clear();
    } else {
      this.roomResService.update(this.roomRes).subscribe({
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
  }

  deleteSelected() {
    this.selection.selected.forEach(foodRes => {
      this.roomResService.delete(foodRes.id).subscribe({
        next: (response: any) => {
          console.log('Eliminado: ' + foodRes.id);
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
    this.roomRes = new RoomRes(1, null!, null!, null!, "", "");
  }

  /****************************************************************Métodos Dialog******************************************************************************************************/

  setValueOfObject() {
    this.roomRes = this.selection.selected[0];
  }

  resetTable() {
    this.index();
    this.selection.clear();
  }
}
