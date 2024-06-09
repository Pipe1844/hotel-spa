import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.services';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[UserService]
})

export class LoginComponent {

  public status:number;

  public user:User;

  
  constructor(
    private _userService:UserService
  ){
    this.status=-1;
    this.user=new User(1,1,"","","","","","","")
  }

  onSubmit(form:any){
    //console.log("iniciando Sesion")
    //console.log(this.user.correo)

    this._userService.login(this.user).subscribe({
      next:(response:any)=>{


        if(response.status!=401){
            sessionStorage.setItem("token",response);

            this._userService.getIdentityFromAPI().subscribe({
              next:(resp:any)=>{
                //console.log(resp);
                sessionStorage.setItem('identity', JSON.stringify(resp));
              },
              error:(error:Error)=>{
                console.log(error);
              }
            })

        }else{
          this.status=0;  
        }

      },

      error:(err:any)=>{

      }
    })
  }

  

}

