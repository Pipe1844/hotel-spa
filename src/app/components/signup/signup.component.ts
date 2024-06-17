import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { User } from '../../models/User';
import { timer } from 'rxjs'; 
import { UserService } from '../../services/User.services';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterOutlet,RouterLink,FormsModule],

  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public status:number;
  public user:User;
  constructor(
    private _userService:UserService
  ){
    this.status=2;
    this.user=new User(1,null,"","","","","","","","");
  }

  onSubmit(form:any){
    this.user.rol='cliente';
    this._userService.create(this.user).subscribe({
      next:(response=>{
        if(response.status==201){
          form.reset();
          this.changeStatus(0);
        }else{
          this.changeStatus(1);
        }
      }),
      error:(error:Error)=>{
        this.changeStatus(2);
      }
    })
  }

  changeStatus(st:number){
    this.status=st;
    let countDown=timer(3000);
    countDown.subscribe(n=>{
      this.status=-1;
    })
  }

}
