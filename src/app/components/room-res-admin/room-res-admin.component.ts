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
import { UserService } from '../../services/User.services';
import { RoomResService } from '../../services/RoomRes.service';
import { User } from '../../models/User';
import { RoomRes } from '../../models/RoomRes';

@Component({
  selector: 'app-room-res-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule
          ],
  templateUrl: './room-res-admin.component.html',
  styleUrl: './room-res-admin.component.css',
  providers: [UserService, RoomResService]
})
export class RoomResAdminComponent {
  private checkAutorization;
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

  constructor(private userService: UserService, private roomResService: RoomResService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.roomRes = new RoomRes(1, 1, 1, 0, "", "");
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

  create(/*form: any*/) {
    //if (form.valid) {
    this.roomRes = new RoomRes(1, 1, 3, 0, "2024-05-05", "2024-05-07");
    this.roomResService.create(this.roomRes).subscribe({
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
    //}
  }

  update() {
    this.roomRes = new RoomRes(6, 1, 3, 0, "2024-05-05", "2024-05-08");
    this.roomResService.update(this.roomRes).subscribe({
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
}
