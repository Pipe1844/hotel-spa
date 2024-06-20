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
import Swal from 'sweetalert2'


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
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cargar las reservas", "error");
      }
    });
  }

  createRow() {
    if (this.roomRes.fechaEntrada == this.roomRes.fechaSalida) {
      this.msgAlert("Error", "La fecha de entrada y de salida no pueden ser las mismas", "error");
      this.index();
      this.selection.clear();
    } else {
      this.roomResService.create(this.roomRes).subscribe({
        next: (response: any) => {
          this.msgAlert("Agregada", "Se ha reservado correctamente", "success");
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al agregar la reserva", "error");
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
      this.msgAlert("Error", "La fecha de entrada y de salida no pueden ser las mismas", "error");
      this.index();
      this.selection.clear();
    } else {
      this.roomResService.update(this.roomRes).subscribe({
        next: (response: any) => {
          this.msgAlert("Actualizado", "Reserva modificada exitosamente", "success");
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al actualizar la reserva", "error");
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
          this.msgAlert("Eliminado", "Reservas eliminadas correctamente", "success");
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al eliminar las reservas", "error");
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

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
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
