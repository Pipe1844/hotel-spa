import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { User } from '../../models/user';
import { timer } from 'rxjs';
import { UserService } from '../../services/user.services';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],

  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public status: number;
  public user: User;
  public selectedFile: File | null = null;
  
  constructor(
    private _userService: UserService,
    private router: Router
  ) {
    this.status = -1;
    this.user = new User(1, null, "", "", "", "", "", "", "", "");
  }

  onSubmit(form: any) {
    this.user.rol = 'cliente';
    if (this.selectedFile == null) {
      this.create("");
      form.reset();
    } else {
      this._userService.uploadImage(this.selectedFile!).subscribe({
        next: (response: any) => {
          console.log(response['filename']);
          this.create(response['filename']);
        },
        error: (err: Error) => {
          console.log(err);
        }
      });
    }
  }

  changeStatus(st: number) {
    this.status = st;
    let countDown = timer(3000);
    countDown.subscribe(n => {
      this.status = -1;
    })
  }

  create(filename: string) {
    this.user.imagen = filename;
    this._userService.create(this.user).subscribe({
      next: (response => {
        if (response.status == 201) {
          this.changeStatus(0);
        } else {
          this.changeStatus(1);
        }
        this.router.navigate(['login'])
      }),
      error: (error: Error) => {
        this.changeStatus(2);
        console.log(error);
      }
    });
  }

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}
