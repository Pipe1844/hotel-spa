import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { RoomTypeAdminComponent } from './components/room-type-admin/room-type-admin.component';
import { RoomAdminComponent } from './components/room-admin/room-admin.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'userAdmin',component:UserAdminComponent},
    {path:'roomTypeAdmin',component:RoomTypeAdminComponent},
    {path:'roomAdmin',component:RoomAdminComponent},
    {path:'**',component:ErrorComponent},
];
