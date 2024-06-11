import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { RoomType } from "../models/RoomType";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class TipoHabitacionService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
