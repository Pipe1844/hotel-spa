import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.services';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})

export class LoginComponent {

  public status: number;

  public user: User;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _routes: ActivatedRoute
  ) {
    this.status = -1;
    this.user = new User(1, 1, "", "", "", "", "", "", "", "");
  }

  onSubmit(form: any) {
    this._userService.login(this.user).subscribe({
      next: (response: any) => {
        if (response.status != 401) {
          sessionStorage.setItem("token", response);
          this._userService.getIdentityFromAPI().subscribe({
            next: (resp: any) => {
              sessionStorage.setItem('identity', JSON.stringify(resp));
              this._router.navigate(['']);
            },
            error: (error: Error) => {
              this.status = 1;
            }
          })
        } else {
          this.status = 0;
        }
      },
      error: (err: any) => {
        this.msgAlert("Error", "Error de inicio de sesión, intentelo más tarde", "error");
      }
    });
  }

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }

}

