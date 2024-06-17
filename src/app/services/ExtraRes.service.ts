import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { ExtraRes } from "../models/ExtraRes";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ExtraResService{
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
        return this._hhttp.get(this.urlAPI + 'foodres', options);
    }

    show(id:number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'foodres/' + id, options);
    }

    create(extraRes:ExtraRes):Observable<any>{
        let userJson = JSON.stringify(extraRes);
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

        return this._hhttp.post(this.urlAPI + 'foodres/store', params, options)
    }

    update(extraRes:ExtraRes):Observable<any>{
        let userJson = JSON.stringify(extraRes);
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

        return this._hhttp.put(this.urlAPI + 'foodres/update', params, options)
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
        return this._hhttp.delete(this.urlAPI + 'foodres/' + id, options);
    }
}
