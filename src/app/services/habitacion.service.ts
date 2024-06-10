import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { Habitacion } from "../models/Habitacion";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class HabitacionService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
