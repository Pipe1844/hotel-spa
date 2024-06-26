import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
            RouterOutlet, RouterLink
          ],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css',
  providers: [UserService]
})
export class UserAdminComponent implements AfterViewInit {

  // private checkAutorization;
  public user: User;
  public identity: any;
  public urlGetImageApi: string = server.url + "user/getimage/";
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'cedula', 'nombre', 'apellido', 'correo', 'usuario', 'telefono', 'rol', 'imagen'];
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router:Router
    ) {
    this.user = new User(1, null!, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    // this.checkAutorization = setInterval(() => {
    //   this.getAuth();
    // }, 5000)
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
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.userService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['users'];
        console.log(this.dataSource.data);
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cargar los usuarios", "error");
      }
    });
  }

  createRow() {
    this.user.rol = 'cliente';
    if (this.selectedFile == null) {
      this.create("");
    } else {
      this.userService.uploadImage(this.selectedFile!).subscribe({
        next: (response: any) => {
          this.create(response['filename']);
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al subir la imagen", "error");
        }
      });
    }
  }

  create(filename: string) {
    this.user.imagen = filename;
    this.userService.create(this.user).subscribe({
      next: (response: any) => {
        this.msgAlert("Agregado", "Usuario ingresado correctamente", "success");
      },
      error: (error: Error) => {
        this.msgAlert("Error", "Error al crear el usuario", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  updateRow(){
    if (this.selectedFile == null) {
      this.update(this.user.imagen);
    } else {
      if (this.user.imagen == null || this.user.imagen == ""){
        this.userService.uploadImage(this.selectedFile!).subscribe({
          next: (response: any) => {
            this.update(response['filename']);
          },
          error: (err: Error) => {
            this.msgAlert("Error", "Error al subir la imagen", "error");
          }
        });
      } else {
        this.userService.updateImage(this.selectedFile!, this.user.imagen).subscribe({
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
    this.user.imagen = filename;
    console.log(this.user.imagen)
    this.userService.update(this.user).subscribe({
      next: (response: any) => {
        this.msgAlert("Actualizado", "Usuario modificado exitosamente", "success");
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al modificar el usuario", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  changeRole(id: number, status: boolean) {
    let rol = "cliente";
    if (status) {
      rol = "admin"
    }
    this.user.id = id;
    this.user.rol = rol;

    this.userService.updateRole(this.user).subscribe({
      next: (response: any) => {
        this.index();
        this.selection.clear();
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cambiar el rol del usuario", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
      }
    })
  }

  deleteSelected() {
    this.selection.selected.forEach(user => {
      if (user.id != this.identity.iss) {
        this.userService.delete(user.id).subscribe({
          next: (response: any) => {
            console.log('Eliminado: ' + user.nombre);
            this.userService.destroyImage(user.imagen).subscribe({
              next:(response:any)=>{
                this.msgAlert("Eliminado", "Usuarios eliminados correctamente", "success");
              },
              error:(err:Error)=>{
                this.msgAlert("Error", "Error al eliminar los usuarios", "error");
              }
            });
          },
          error: (err: Error) => {
            console.log(err);
          },
          complete: () => {
            this.index();
            this.selection.clear();
          }
        })
      } else {
        this.msgAlert("Error", "No te puedes eliminar a ti mismo", "error");
      }
    });
    this.index();
    this.selection.clear();
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  resetObject() {
    this.user = new User(1, null!, "", "", "", "", "", "", "", "");
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
    this.user = this.selection.selected[0];
  }

  resetTable(){
    this.index();
    this.selection.clear();
  }
}

