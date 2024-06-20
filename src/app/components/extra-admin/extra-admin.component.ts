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
import Swal from 'sweetalert2'

import { server } from '../../services/global ';
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';
import { ExtraService } from '../../services/Extra.service';
import { Extra } from '../../models/Extra';

@Component({
  selector: 'app-extra-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
            RouterLink, RouterOutlet
          ],
  templateUrl: './extra-admin.component.html',
  styleUrl: './extra-admin.component.css',
  providers: [UserService, ExtraService]
})
export class ExtraAdminComponent {
  // private checkAutorization;
  public user: User;
  public identity: any;
  public extra: Extra;
  public urlGetImageApi: string = server.url + "extra/getimage/";
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'nombre', 'ubicacion', 'precio', 'capacidad', 'imagen'];
  dataSource = new MatTableDataSource<Extra>([]);
  selection = new SelectionModel<Extra>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService, 
    private extraService: ExtraService,
    private router: Router
  ) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    // this.checkAutorization = setInterval(() => {
    //   this.getAuth();
    // }, 5000)
    this.extra = new Extra(1, "", "", 0, 0, "");
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
  checkboxLabel(row?: Extra): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.extraService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['data'];
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cargar los extras", "error");

      }
    });
  }

  createRow() {
    if (this.selectedFile == null) {
      this.create("");
    } else {
      this.extraService.uploadImage(this.selectedFile!).subscribe({
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
    this.extra.imagen = filename;
    this.extraService.create(this.extra).subscribe({
      next: (response: any) => {
        this.msgAlert("Agregadp", "Extra agregado correctamente", "success");

      },
      error: (error: Error) => {
        this.msgAlert("Error", "Error al agregar el extra", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  updateRow() {
    if (this.selectedFile == null) {
      this.update(this.extra.imagen);
    } else {
      if (this.extra.imagen == null) {
        this.extraService.uploadImage(this.selectedFile!).subscribe({
          next: (response: any) => {
            this.update(response['filename']);
          },
          error: (err: Error) => {
            this.msgAlert("Error", "Error al subir la imagen", "error");

          }
        });
      } else {
        this.extraService.updateImage(this.selectedFile!, this.extra.imagen).subscribe({
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

  update(filename: string) {
    this.extra.imagen = filename;
    console.log(this.extra.imagen)
    this.extraService.update(this.extra).subscribe({
      next: (response: any) => {
        this.msgAlert("Actualizado", "Extra modificado correctamente", "success");
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al actualizar el extra", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
        this.selectedFile = null;
      }
    });
  }

  deleteSelected() {
    this.selection.selected.forEach(extra => {

      this.extraService.delete(extra.id).subscribe({
        next: (response: any) => {
          this.msgAlert("Eliminado", "Extras eliminados correctamente", "success");
          this.extraService.destroyImage(extra.imagen).subscribe({
            next:(response:any)=>{
            },
            error:(err:Error)=>{
            }
          });
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al eliminar los extras", "error");
        },
        complete: () => {
          this.index();
          this.selection.clear();
        }
      })
    });
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  resetObject() {
    this.extra = new Extra(1, "", "", null!, null!, "");
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
    this.extra = this.selection.selected[0];
  }

  resetTable() {
    this.index();
    this.selection.clear();
  }
}
