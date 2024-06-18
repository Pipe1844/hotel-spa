import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { UserService } from '../../services/user.services';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/Room';
import { server } from '../../services/global ';

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
  public rooms: Room[] = [];
  public room!: Room;
  public urlGetImageApi: string = server.url + "room/getimage/";

  constructor(private userService: UserService,
    private router: Router,
    private roomService: RoomService
  
  ) {
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.getAuth();
    }, 1000)

    this.index();

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


  logOut(){
    sessionStorage.clear();
  }

  index() {
    this.roomService.index().subscribe({
      next: (response: any) => {
        this.rooms = response['data'];
        console.log(this.rooms);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });

  }

}


