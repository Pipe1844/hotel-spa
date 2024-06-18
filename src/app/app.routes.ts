import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { RoomTypeAdminComponent } from './components/room-type-admin/room-type-admin.component';
import { RoomAdminComponent } from './components/room-admin/room-admin.component';
import { SignupComponent } from './components/signup/signup.component';
import { FoodAdminComponent } from './components/food-admin/food-admin.component';
import { ExtraAdminComponent } from './components/extra-admin/extra-admin.component';
import { ExtraResAdminComponent } from './components/extra-res-admin/extra-res-admin.component';
import { FoodResAdminComponent } from './components/food-res-admin/food-res-admin.component';
import { RoomResAdminComponent } from './components/room-res-admin/room-res-admin.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'admin',component:AdminComponent},
    {path:'userAdmin',component:UserAdminComponent},
    {path:'roomTypeAdmin',component:RoomTypeAdminComponent},
    {path:'roomAdmin',component:RoomAdminComponent},
    {path:'foodAdmin',component:FoodAdminComponent},
    {path:'extraAdmin',component:ExtraAdminComponent},
    {path:'extraResAdmin',component:ExtraResAdminComponent},
    {path:'foodResAdmin',component:FoodResAdminComponent},
    {path:'roomResAdmin',component:RoomResAdminComponent},
    {path:'**',component:ErrorComponent},
];
