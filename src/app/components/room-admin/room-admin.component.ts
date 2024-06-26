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
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { server } from '../../services/global ';
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/Room';
import { RoomTypeService } from '../../services/RoomType.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-room-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
            RouterLink, RouterOutlet
          ],
  templateUrl: './room-admin.component.html',
  styleUrl: './room-admin.component.css',
  providers: [UserService, RoomService, RoomTypeService]
})
export class RoomAdminComponent {
  // private checkAutorization;
  public user: User;
  public identity: any;
  public room: Room;
  public urlGetImageApi: string = server.url + "room/getimage/";
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'idTipoHabitacion', 'ubicacion', 'imagen'];
  dataSource = new MatTableDataSource<Room>([]);
  selection = new SelectionModel<Room>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService, 
    private roomService: RoomService, 
    private roomTypeService: RoomTypeService,
    private router: Router
  ) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    // this.checkAutorization = setInterval(() => {
    //   this.getAuth();
    // }, 5000)
    this.room = new Room(1, 1, "", "");
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
  checkboxLabel(row?: Room): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.roomService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['data'];
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cargar las habitaciones", "error");
      }
    });
  }

  createRow() {
    if (this.selectedFile == null) {
      this.create("");
    } else {
      this.roomService.uploadImage(this.selectedFile!).subscribe({
        next: (response: any) => {
          this.create(response['filename']);
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al agregar la habitación", "error");
        }
      });
    }
  }

  create(filename: string) {
    this.room.imagen = filename;
    this.roomService.create(this.room).subscribe({
      next: (response: any) => {
        this.msgAlert("Agregado", "Habitación agregada correctamente", "success");
      },
      error: (error: Error) => {
        this.msgAlert("Error", "Error al crear la habitación", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  updateRow(){
    console.log(this.selectedFile)
    if (this.selectedFile == null) {
      this.update(this.room.imagen);
    } else {
      if (this.room.imagen == null || this.room.imagen == "" ){
        this.roomService.uploadImage(this.selectedFile!).subscribe({
          next: (response: any) => {
            this.update(response['filename']);
          },
          error: (err: Error) => {
            this.msgAlert("Error", "Error al subir la imagen", "error");
          }
        });
      } else {
        this.roomService.updateImage(this.selectedFile!, this.room.imagen).subscribe({
          next: (response: any) => {
            this.update(response['filename']);
          },
          error: (err: Error) => {
            this.msgAlert("Error", "Error al actualizar la imagen", "error");
          }
        });
      }
    }
  }

  update(filename:string) {
    this.room.imagen = filename;
    console.log(this.room.imagen)
    this.roomService.update(this.room).subscribe({
      next: (response: any) => {
        this.msgAlert("Actualizado", "Habitación actualizada correctamente", "success");
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al actualizar la habitación", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  deleteSelected() {
    this.selection.selected.forEach(room => {
      this.roomService.delete(room.id).subscribe({
        next: (response: any) => {
          this.msgAlert("Eliminado", "Habitación eliminada correctamente", "success");
          this.roomService.destroyImage(room.imagen).subscribe({
            next:(response:any)=>{
            },
            error:(err:Error)=>{
            }
          });
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al eliminar las habitaciones", "error");
        },
        complete: () => {
          this.index();
          this.selection.clear();
        }
      });
    });
    this.index();
    this.selection.clear();
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  resetObject() {
    this.room = new Room(1, null!, "", "");
    this.selectedFile = null;
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
    this.room = this.selection.selected[0];
    this.selectedFile = null;
  }

  resetTable(){
    this.index();
    this.selection.clear();
  }
}
