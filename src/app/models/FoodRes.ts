export class FoodRes {
    constructor(
        public id: number,
        public idUser: number,
        public idAlimentacion: number,
        public precioTotal: number,
        public fechaServicio: string,
        public cantidad: number
    ) {}
}