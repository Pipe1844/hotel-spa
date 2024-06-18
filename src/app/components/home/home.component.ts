import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { UserService } from '../../services/user.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [UserService]
})
export class HomeComponent {
  public identity: any;
  private checkAutorization;
  constructor(private userService: UserService,
    private router: Router
  ) {
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.getAuth();
    }, 1000)
  }

  getAuth() {
    this.userService.getAuthTokenFromAPI().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response) {
          this.identity = this.userService.getIdentityFromStorage();
          console.log(this.identity);
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

}


