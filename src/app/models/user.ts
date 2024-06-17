export class User{
    constructor(
        public id:number,
        public cedula:number|null,
        public nombre:string,
        public correo:string,
        public password:string,
        public usuario:string,
        public apellido:string,
        public telefono:string,
        public rol:string,
        public imagen:string
    ){}
}