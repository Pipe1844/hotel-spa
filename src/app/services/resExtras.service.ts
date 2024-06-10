import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { ResExtras } from "../models/ResExtras";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ResExtrasService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
