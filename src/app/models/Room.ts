export class Room {
    constructor(
        public id: number,
        public idTipoHabitacion: number | null,
        public ubicacion: string,
        public imagen: string
    ) {}
}