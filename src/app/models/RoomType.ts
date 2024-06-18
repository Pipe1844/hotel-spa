export class RoomType {
    constructor(
        public id: number,
        public nombre: string,
        public precio: number | null,
        public capacidad: number | null
    ) {}
}