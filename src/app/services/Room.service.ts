import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { Room } from "../models/Room";
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

    index(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'room', options);
    }

    show(id:number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'room/' + id, options);
    }

    create(room:Room):Observable<any>{
        let userJson = JSON.stringify(room);
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

        return this._hhttp.post(this.urlAPI + 'room/store', params, options)
    }

    update(room:Room):Observable<any>{
        let userJson = JSON.stringify(room);
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

        return this._hhttp.put(this.urlAPI + 'room/update', params, options)
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
        return this._hhttp.delete(this.urlAPI + 'room/' + id, options);
    }

    /*******************************************************************Métodos imagen**********************************************************************************************/

    upLoadImage(image: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
            headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._hhttp.post(this.urlAPI + 'room/uploadimage', formData, { headers });
    }

    updateImage(image: File, filename: string) {
        const formData: FormData = new FormData();
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
            headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._hhttp.put(this.urlAPI + 'room/updateimage/' + filename, formData, { headers });
    }

    getImage(filename: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._hhttp.get(`${this.urlAPI}room/getimage/${filename}`, options);
    }

    destroyImage(filename: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._hhttp.delete(`${this.urlAPI}room/image/${filename}`, options);
    }
}
