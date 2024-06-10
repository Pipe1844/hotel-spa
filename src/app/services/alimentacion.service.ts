import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { Alimentacion } from "../models/Alimentacion";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AlimentacionService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
