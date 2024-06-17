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
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/Room';
import { RoomTypeService } from '../../services/RoomType.service';

@Component({
  selector: 'app-room-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
    MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
  ],
  templateUrl: './room-admin.component.html',
  styleUrl: './room-admin.component.css',
  providers: [UserService, RoomService, RoomTypeService]
})
export class RoomAdminComponent {
  private checkAutorization;
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

  constructor(private userService: UserService, private roomService: RoomService, private roomTypeService: RoomTypeService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.room = new Room(1, 1, "", "");
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
    this.room = new Room(1, 1, "Pasillo principal", filename);
    this.roomService.create(this.room).subscribe({
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

    if (this.room.imagen != "") {
      if (this.selectedFile != null) {
        filename = this.updateImage(this.room.imagen);
      }
    } else {
      if (this.selectedFile == null) {
        filename = "";
      } else {
        filename = this.uploadImage();
      }
    }

    this.room = new Room(3, 2, "Lado derecho de recepción", filename);
    this.roomService.update(this.room).subscribe({
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

      this.roomService.delete(room.id).subscribe({
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

  /*******************************************************************Métodos RoomTypeService**********************************************************************************************/

  showRoomType(id: number): any {
    this.roomTypeService.show(id).subscribe({
      next: (response: any) => {
        console.log(response['data'].nombre);
        return response['data'].nombre;
      },
      error: (err: Error) => {
        console.log(err);
        return null;
      }
    })
  }

  /*******************************************************************Métodos imagen**********************************************************************************************/

  uploadImage(): any {
    this.roomService.uploadImage(this.selectedFile!).subscribe({
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
    this.roomService.updateImage(this.selectedFile!, filename).subscribe({
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
