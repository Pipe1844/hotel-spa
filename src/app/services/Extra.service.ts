import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { Extra } from "../models/Extra";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class ExtraService{
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
        return this._hhttp.get(this.urlAPI + 'extra', options);
    }

    show(id:number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        let options = {
            headers
        }
        return this._hhttp.get(this.urlAPI + 'extra/' + id, options);
    }

    create(extra:Extra):Observable<any>{
        let userJson = JSON.stringify(extra);
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

        return this._hhttp.post(this.urlAPI + 'extra/store', params, options)
    }

    update(extra:Extra):Observable<any>{
        let userJson = JSON.stringify(extra);
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

        return this._hhttp.put(this.urlAPI + 'extra/update', params, options)
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
        return this._hhttp.delete(this.urlAPI + 'extra/' + id, options);
    }

    /*******************************************************************Métodos imagen**********************************************************************************************/

    uploadImage(image: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
            headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._hhttp.post(this.urlAPI + 'extra/uploadimage', formData, { headers });
    }

    updateImage(image: File, filename: string) {
        const formData: FormData = new FormData();
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
            headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._hhttp.post(this.urlAPI + 'extra/updateimage/' + filename, formData, { headers });
    }

    getImage(filename: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._hhttp.get(`${this.urlAPI}extra/getimage/${filename}`, options);
    }

    destroyImage(filename: string): Observable<any> {
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
        return this._hhttp.delete(`${this.urlAPI}extra/image/${filename}`, options);
    }
}
