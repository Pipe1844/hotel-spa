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
import { RoomTypeService } from '../../services/RoomType.service';
import { User } from '../../models/User';
import { UserService } from '../../services/User.services';
import { RoomType } from '../../models/RoomType';

@Component({
  selector: 'app-room-type-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
    MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule
  ],
  templateUrl: './room-type-admin.component.html',
  styleUrl: './room-type-admin.component.css',
  providers: [RoomTypeService, UserService]
})
export class RoomTypeAdminComponent implements AfterViewInit {
  private checkAutorization;
  public user: User;
  public identity: any;
  public roomType: RoomType;
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'nombre', 'precio', 'capacidad'];
  dataSource = new MatTableDataSource<RoomType>([]);
  selection = new SelectionModel<RoomType>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private roomTypeService: RoomTypeService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.roomType = new RoomType(1, "", 0, 0);
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
  checkboxLabel(row?: RoomType): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.roomTypeService.index().subscribe({
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
    this.roomType = new RoomType(1, "Cama King", 50000, 2);
    this.roomTypeService.create(this.roomType).subscribe({
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

    //}
  }

  update() {
    this.roomType = new RoomType(12, "Cama King", 25000, 2);
    this.roomTypeService.update(this.roomType).subscribe({
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
  }

  deleteSelected() {
    this.selection.selected.forEach(roomType => {
      this.roomTypeService.delete(roomType.id).subscribe({
        next: (response: any) => {
          console.log('Eliminado: ' + roomType.nombre);
        },
        error: (err: Error) => {
          console.log(err);
        },
        complete:()=>{
          this.index();
          this.selection.clear();
        }
      })
    });
  }
  /****************************************************************Demás métodos******************************************************************************************************/
}
