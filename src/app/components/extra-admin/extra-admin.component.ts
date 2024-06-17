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
import { ExtraService } from '../../services/Extra.service';
import { Extra } from '../../models/Extra';

@Component({
  selector: 'app-extra-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
          ],
  templateUrl: './extra-admin.component.html',
  styleUrl: './extra-admin.component.css',
  providers: [UserService, ExtraService]
})
export class ExtraAdminComponent {
  private checkAutorization;
  public user: User;
  public identity: any;
  public extra: Extra;
  public urlGetImageApi: string = server.url + "room/getimage/";
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'nombre', 'ubicacion', 'precio', 'capacidad', 'imagen'];
  dataSource = new MatTableDataSource<Extra>([]);
  selection = new SelectionModel<Extra>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private extraService: ExtraService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.extra = new Extra(1, "", "", 0, 0, "");
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
    this.extra = new Extra(1, "Teatro", "Costado este", 300000, 120, filename);
    this.extraService.create(this.extra).subscribe({
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
    this.index();
    //}
  }

  update() {
    let filename: any;

    if (this.extra.imagen != "") {
      if (this.selectedFile != null) {
        filename = this.updateImage(this.extra.imagen);
      }
    } else {
      if (this.selectedFile == null) {
        filename = "";
      } else {
        filename = this.uploadImage();
      }
    }

    this.extra = new Extra(4, "Teatro", "Costado este", 200000, 120, filename);
    this.extraService.update(this.extra).subscribe({
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
    });
    this.index();
    this.selection.clear();
  }

  deleteSelected() {
    this.selection.selected.forEach(room => {

      this.extraService.delete(room.id).subscribe({
        next: (response: any) => {
          console.log('Eliminado: ' + room.id);
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
    this.index();
    this.selection.clear();
  }

  /*******************************************************************Métodos imagen**********************************************************************************************/

  uploadImage(): any {
    this.extraService.uploadImage(this.selectedFile!).subscribe({
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
    this.extraService.updateImage(this.selectedFile!, filename).subscribe({
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
