import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UserService } from '../../services/User.services';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule,  } from '@angular/material/slide-toggle';
import { User } from '../../models/User';
import { server } from '../../services/global ';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSlideToggleModule, FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css',
  providers: [UserService]
})
export class UserAdminComponent implements AfterViewInit{

  public user:User;
  public identity:any;
  private checkAutorization;

  urlGetImageApi:string = server.url + "user/getimage/";
  displayedColumns: string[] = ['id', 'cedula', 'nombre', 'apellido', 'correo', 'usuario', 'telefono', 'rol', 'imagen'];
  dataSource = new MatTableDataSource<User>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService:UserService) {
    this.user = new User(1, 1,"","","","","","","","");
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

  /**************************************************************Métodos del Service**********************************************************************************/

  index(){
    this.userService.index().subscribe({
      next:(response:any)=>{
        this.dataSource.data = response['users'];
        console.log(this.dataSource.data);
      },
      error:(err:Error)=>{
        console.log(err);
      }
    });
  }

  changeRole(id:number, status: boolean){
    let rol = "cliente";
    if (status){
      rol = "admin"
    }
    this.user.id = id;
    this.user.rol = rol;

    this.userService.updateRole(this.user).subscribe({
      next:(response:any)=>{
        console.log(response);
        this.index();
      },
      error:(err:Error)=>{
        console.log(err);
      }
    })
  }
}
