import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { RoomType } from "../models/RoomType";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class RoomTypeService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }

    index(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'roomtype', options);
    }

    show(id:number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'roomtype/' + id, options);
    }

    create(roomType:RoomType):Observable<any>{
        let userJson = JSON.stringify(roomType);
        let params = 'data=' + userJson;
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if (bearerToken) {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('bearertoken', bearerToken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }

        let options = {
            headers
        }

        return this._hhttp.post(this.urlAPI + 'roomtype/store', params, options)
    }

    update(roomType:RoomType):Observable<any>{
        let userJson = JSON.stringify(roomType);
        let params = 'data=' + userJson;
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if (bearerToken) {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                .set('bearertoken', bearerToken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }

        let options = {
            headers
        }

        return this._hhttp.put(this.urlAPI + 'roomtype/update', params, options)
    }

    delete(id:number):Observable<any> {
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._hhttp.delete(this.urlAPI + 'roomtype/' + id, options);
    }
}
