import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { ResAlimentacion } from "../models/ResAlimentacion";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ResAlimentacionService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
