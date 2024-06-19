import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.services';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/Room';
import { server } from '../../services/global ';
import { RoomTypeService } from '../../services/RoomType.service';
import { RoomType } from '../../models/RoomType';
import { RoomRes } from '../../models/RoomRes';
import { RoomResService } from '../../services/RoomRes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [UserService]
})
export class HomeComponent {
  public identity: any;
  private checkAutorization;
  public rooms: Room[] = [];
  public room!: Room;
  public roomType!: RoomType;
  public roomRes: RoomRes;
  public roomTypes: RoomType[] = [];
  public urlGetImageApi: string = server.url + "room/getimage/";

  constructor(private userService: UserService,
    private router: Router,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private roomResService: RoomResService

  ) {
    this.identity = this.userService.getIdentityFromStorage();
    this.checkAutorization = setInterval(() => {
      this.getAuth();
    }, 5000)
    this.roomRes = new RoomRes(1, 1, 1, 0, "", "");
    this.index();
    this.indexRoomTypes();
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

  logOut() {
    sessionStorage.clear();
  }
  /**************************************************************Métodos del Service**********************************************************************************/

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

  indexRoomTypes() {
    this.roomTypeService.index().subscribe({
      next: (response: any) => {
        this.roomTypes = response['data'];
        console.log(this.roomTypes);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  createRes() {
    if (this.roomRes.fechaEntrada == this.roomRes.fechaSalida) {
      console.log("La fecha de entrada y de salida no pueden ser las mismas");
    } else {
      this.roomResService.create(this.roomRes).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (err: Error) => {
          console.log(err);
        },
        complete: () => {
        }
      });
    }
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  public formatDate(event: Event): string {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    return `${fecha.getFullYear()}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${('0' + fecha.getDate()).slice(-2)}`;
  }

  setObject(room: Room) {
    this.roomRes = new RoomRes(1, this.identity.iss, room.id, null!, "", "");
  }
}


