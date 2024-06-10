import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { Extras } from "../models/Extras";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ExtrasService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }
}
