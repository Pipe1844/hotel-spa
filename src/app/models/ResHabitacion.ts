export class ResHabitacion {
    constructor(
        public id: number,
        public idUser: number,
        public idHabitacion: number,
        public total: number,
        public fechaEntrada: string,
        public fechaSalida: string
    ) {}
}