import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global ";
import { User } from "../models/User";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UserService{
    private urlAPI:string
    constructor(
        private _hhttp: HttpClient
    ){
        this.urlAPI=server.url;
    }

    login(user:User):Observable<any>{
        let userJson=JSON.stringify(user);
        let params='data='+userJson;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
        let options={
            headers
        }

        return this._hhttp.post(this.urlAPI+'user/login', params, options)

    }

    getIdentityFromAPI():Observable<any>{
        let headers;
        let bearerToken=sessionStorage.getItem('token');

        //console.log(bearerToken);

        if(bearerToken){
            headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
            .set('bearertoken', bearerToken);
        }else{
            headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        }

        let options={
            headers
        }

        return this._hhttp.get(this.urlAPI+'user/getidentity', options);
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
        return this._hhttp.post(this.urlAPI+'user/uploadimage', formData, { headers });
    }

    updateImage(image: File, filename: string){
        const formData: FormData = new FormData(); 
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
        headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._hhttp.put(this.urlAPI+'user/updateimage/'+filename, formData, { headers });
    }

    getImage(filename: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._hhttp.get(`${this.urlAPI}user/getimage/${filename}`, options);
    }

    destroyImage(filename:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._hhttp.delete(`${this.urlAPI}user/image/${filename}`, options);
    }
}
