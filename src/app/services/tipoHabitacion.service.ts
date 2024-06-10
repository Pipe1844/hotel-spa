import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { TipoHabitacion } from "../models/TipoHabitacion";
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
