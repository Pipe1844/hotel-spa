import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { server } from '../../services/global ';
import { UserService } from '../../services/user.services';
import { ExtraService } from '../../services/Extra.service';
import { RoomService } from '../../services/Room.service';
import { FoodService } from '../../services/Food.service';
import { ExtraResService } from '../../services/ExtraRes.service';
import { RoomResService } from '../../services/RoomRes.service';
import { FoodResService } from '../../services/FoodRes.service';
import { RoomTypeService } from '../../services/RoomType.service';
import { Extra } from '../../models/Extra';
import { Room } from '../../models/Room';
import { RoomType } from '../../models/RoomType';
import { Food } from '../../models/Food';
import { RoomRes } from '../../models/RoomRes';
import { ExtraRes } from '../../models/ExtraRes';
import { FoodRes } from '../../models/FoodRes';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
  providers: [UserService, ExtraService, ExtraResService, RoomTypeService, RoomService, RoomResService, FoodService, FoodResService]
})
export class ReservaComponent {

  public identity: any;
  public extra!: Extra;
  public extras: Extra[] = [];
  public room!: Room;
  public rooms: Room[] = [];
  public roomType!: RoomType;
  public roomTypes: RoomType[] = [];
  public food!: Food;
  public foods: Food[] = [];
  public roomRes!: RoomRes;
  public extraRes!: ExtraRes;
  public foodRes!: FoodRes;
  public urlGetRoomImage: string = server.url + "room/getimage/";
  public urlGetExtraImage: string = server.url + "extra/getimage/";

  constructor(
    private userService: UserService,
    private extraService: ExtraService,
    private extraResService: ExtraResService,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private roomResService: RoomResService,
    private foodService: FoodService,
    private foodResService: FoodResService,
    private router: Router,
  ) {
    this.identity = this.userService.getIdentityFromStorage();
    this.extra = new Extra(1, "", "", null!, null!, "");
    this.room = new Room(1, 1, "", "");
    this.roomType = new RoomType(1, "", null!, null!);
    this.food = new Food(1, "", 1, "");
    this.roomRes = new RoomRes(1, 1, 1, null!, "", "");
    this.extraRes = new ExtraRes(1, 1, 1, "", null!, null!);
    this.foodRes = new FoodRes(1, 1, 1, null!, "", null!);
    this.extraIndex();
    this.foodIndex();
    this.roomIndex();
    this.roomTypeIndex();
  }

  /***************************************************************Métodos index**********************************************************************************************/

  extraIndex() {
    this.extraService.index().subscribe({
      next: (response: any) => {
        this.extras = response['data'];
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  foodIndex() {
    this.foodService.index().subscribe({
      next: (response: any) => {
        this.foods = response['alimentos'];
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  roomIndex() {
    this.roomService.index().subscribe({
      next: (response: any) => {
        this.rooms = response['data'];
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  roomTypeIndex() {
    this.roomTypeService.index().subscribe({
      next: (response: any) => {
        this.roomTypes = response['data'];
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  /***************************************************************Métodos store********************************************************************************************/

  createRoomRes() {
    if (this.roomRes.fechaEntrada == this.roomRes.fechaSalida) {
      console.log("La fecha de entrada y de salida no pueden ser las mismas");
    } else {
      this.roomResService.create(this.roomRes).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (err: Error) => {
          console.log(err);
        }
      });
    }
  }

  createExtraRes() {
    this.extraResService.create(this.extraRes).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  createFoodRes() {
    this.foodResService.create(this.foodRes).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  /***************************************************************Métodos seteo de objetos*********************************************************************************/

  setRoomResObject(room: Room) {
    this.roomRes = new RoomRes(1, this.identity.iss, room.id, null!, "", "");
  }

  setExtraResObject(extra: Extra) {
    this.extraRes = new ExtraRes(1, this.identity.iss, extra.id, "", null!, null!);
  }

  setFoodResObject(food: Food) {
    this.foodRes = new FoodRes(1, this.identity.iss, food.id, null!, "", null!);
  }

  /****************************************************************Demás métodos******************************************************************************************************/

  public formatDate(event: Event): string {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    return `${fecha.getFullYear()}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${('0' + fecha.getDate()).slice(-2)}`;
  }

  logOut() {
    sessionStorage.clear();
  }
}

