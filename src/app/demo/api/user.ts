export interface IUsuario {
    id: number;
    rol: string;
    nombre: string;
    apellidos: string;
    email: string;
    celular: number;
    codigo: number;
    fecha_egreso: string | null;
    ciclo: string | null;
    carrera: string;
    linea: string | null;
    sub_lineas: string | null;
    es_revisor: number;
    es_asesor: number;
    es_jurado: number;
    estado: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}