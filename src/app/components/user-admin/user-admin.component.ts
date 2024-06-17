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
import { server } from '../../services/global ';
import { User } from '../../models/User';
import { UserService } from '../../services/User.services';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
    MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
  ],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css',
  providers: [UserService]
})
export class UserAdminComponent implements AfterViewInit {

  private checkAutorization;
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

  constructor(private userService: UserService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
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
        console.log(err);
      }
    });
  }

  create(/*form: any*/) {
    //if (form.valid) {
    let filename: any;
    if (this.selectedFile == null) {
      filename = "";
    } else {
      filename = this.uploadImage();
    }
    this.user = new User(1, 504510344, "Nathaly", "nath@gmail.com", "1234", "nath", "Ramírez", "70054237", "cliente", filename);
    this.userService.create(this.user).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: Error) => {
        console.log(err);
      },
      complete:()=>{
        this.index();
        this.selection.clear();
      }
    })
    this.index();
    //}
  }

  update() {
    let filename: any;

    if (this.user.imagen != "") {
      if (this.selectedFile != null) {
        filename = this.updateImage(this.user.imagen);
      }
    } else {
      if (this.selectedFile == null) {
        filename = "";
      } else {
        filename = this.uploadImage();
      }
    }

    let user = new User(3, 504510344, "Nathaly", "nath@gmail.com", "1234", "Nath", "Ramírez", "70054237", "cliente", filename);
    this.userService.update(user).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: Error) => {
        console.log(err);
      },
      complete:()=>{
        this.index();
        this.selection.clear();
      }
    });
    this.index();
    this.selection.clear();
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
        console.log(response);
        this.index();
        this.selection.clear();
      },
      error: (err: Error) => {
        console.log(err);
      },
      complete:()=>{
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
        console.log('No te puedes eliminar a ti');
      }
    });
    this.index();
    this.selection.clear();
  }

  /*******************************************************************Métodos imagen**********************************************************************************************/

  uploadImage(): any {
    this.userService.uploadImage(this.selectedFile!).subscribe({
      next: (response: any) => {
        console.log(response);
        return response['filename'];
      },
      error: (err: Error) => {
        console.log(err);
        return "";
      }
    })
  }

  updateImage(filename: string) {
    this.userService.updateImage(this.selectedFile!, filename).subscribe({
      next: (response: any) => {
        console.log(response);
        return response['filename'];
      },
      error: (err: Error) => {
        console.log(err);
        return "";
      }
    })
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}
