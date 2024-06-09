import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UserService{
    private urlAPI:string
    constructor(
        private _hhttp:HttpClient
    ){
        this.urlAPI=server.url
    }

    login(user:User):Observable<any>{
        let userJson=JSON.stringify(user);
        let params='data='+userJson;
        let headers=new HttpHeaders().set('content-Type','application/x-www-form-urlencoded')
        let options={
            headers
        }

        return this._hhttp.post(this.urlAPI+'user/login', params, options)

    }
}
