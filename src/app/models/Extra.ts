export class Extra {
    constructor(
        public id: number,
        public nombre: string,
        public ubicacion: string,
        public precio: number | null,
        public capacidad: number | null,
        public imagen: string
    ) {}
}