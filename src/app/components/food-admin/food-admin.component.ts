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
import { FoodService } from '../../services/Food.service';
import { Food } from '../../models/Food';
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-food-admin',
  standalone: true,
  imports: [MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
            MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatIconModule,
            MatButtonModule, ReactiveFormsModule, MatTableModule, MatCheckboxModule, MatDividerModule,
            RouterLink, RouterOutlet
          ],
  templateUrl: './food-admin.component.html',
  styleUrl: './food-admin.component.css',
  providers: [UserService, FoodService]
})
export class FoodAdminComponent {
  // private checkAutorization;
  public user: User;
  public identity: any;
  public food: Food;
  public selectedFile: File | null = null;

  /******************************************Variables para la tabla**************************************************************************/

  displayedColumns: string[] = ['select', 'id', 'horario', 'precio', 'descripcion'];
  dataSource = new MatTableDataSource<Food>([]);
  selection = new SelectionModel<Food>(true, []);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService, 
    private foodService: FoodService,
    private router: Router
  ) {
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
    this.identity = this.userService.getIdentityFromStorage();
    // this.checkAutorization = setInterval(() => {
    //   this.getAuth();
    // }, 5000)
    this.food = new Food(1, "", 0, "");
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
  checkboxLabel(row?: Food): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /**************************************************************Métodos del Service**********************************************************************************/

  index() {
    this.foodService.index().subscribe({
      next: (response: any) => {
        this.dataSource.data = response['alimentos'];
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al cargar las comidas", "error");
      }
    });
  }

  createRow() {
    this.foodService.create(this.food).subscribe({
      next: (response: any) => {
        this.msgAlert("Agregado", "Comida agregada correctamente", "success");
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al crear la comida", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
      }
    })
  }

  updateRow() {
    this.foodService.update(this.food).subscribe({
      next: (response: any) => {
        this.msgAlert("Actualizado", "Comida agregada correctamente", "success");
      },
      error: (err: Error) => {
        this.msgAlert("Error", "Error al actualizar la comida", "error");
      },
      complete: () => {
        this.index();
        this.selection.clear();
      }
    });
  }

  deleteSelected() {
    this.selection.selected.forEach(food => {
      this.foodService.delete(food.id).subscribe({
        next: (response: any) => {
          this.msgAlert("Eliminado", "Comidas eliminadas correctamente", "success");
        },
        error: (err: Error) => {
          this.msgAlert("Error", "Error al eliminar las comidas", "error");
        },
        complete: () => {
          this.index();
          this.selection.clear();
        }
      })
    });
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  resetObject() {
    this.food = new Food(1, "", 0, "");
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
    this.food = this.selection.selected[0];
  }

  resetTable() {
    this.index();
    this.selection.clear();
  }
}
