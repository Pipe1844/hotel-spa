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
import { FoodService } from '../../services/Food.service';
import { UserService } from '../../services/User.services';
import { FoodResService } from '../../services/FoodRes.service';
import { User } from '../../models/User';
import { FoodRes } from '../../models/FoodRes';

@Component({
  selector: 'app-food-res-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule
          ],
  templateUrl: './food-res-admin.component.html',
  styleUrl: './food-res-admin.component.css',
  providers: [UserService, FoodResService]
})
export class FoodResAdminComponent {
  private checkAutorization;
  public user: User;
  public identity: any;
  public foodRes: FoodRes;
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'idUser', 'idFood','precio', 'fechaServicio', 'cantidad'];
  dataSource = new MatTableDataSource<FoodRes>([]);
  selection = new SelectionModel<FoodRes>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private foodResService: FoodResService) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.identity = this.userService.getIdentityFromStorage();
    }, 1000)
    this.foodRes = new FoodRes(1, 1, 1, 0, "", 0);
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
  checkboxLabel(row?: FoodRes): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.foodResService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['reservas'];
        console.log(this.dataSource.data);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  create(/*form: any*/) {
    //if (form.valid) {
    this.foodRes = new FoodRes(1, 3, 5, 0, "2024-05-05", 2);
    this.foodResService.create(this.foodRes).subscribe({
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
    this.foodRes = new FoodRes(14, 3, 5, 0, "2024-05-06", 3);
    this.foodResService.update(this.foodRes).subscribe({
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
      this.foodResService.delete(foodRes.id).subscribe({
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
