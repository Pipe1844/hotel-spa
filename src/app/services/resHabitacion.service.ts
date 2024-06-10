import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { ResHabitacion } from "../models/ResHabitacion";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ResHabitacionService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
