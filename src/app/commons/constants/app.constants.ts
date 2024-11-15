export const allowedUrlsByAuth: string[] = [
    '/auth/login',
    '/',
    '/not-found',
    '/auth/log-out',
    '/auth/access',
    '/auth/forgot-password',
    '/api/reset-password']; // URLs excluidas

export const professionalSchool: { [key: string]: { name: string, code: string } } = {
    ISI: { name: 'ISI - Ingeniería de Sistemas e Informática', code: 'ISI' },
    IET: { name: 'IET - Ingeniería Electrónica y Telecomunicaciones', code: 'IET' },
    IA: { name: 'IA - Ingeniería Ambiental', code: 'IA' },
    II: { name: 'II - Ingeniería Industrial', code: 'II' }
};

export const classByStatusReport: { [key: string]: { class: string } } = {
    1: { class: '--blue-500' },
    2: { class: '--green-600' },
    3: { class: '--red-600' },
    4: { class: '--orange-600' },
    5: { class: '--pink-600' },
    6: { class: '--yellow-600' },
};

export const udiOptions = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/'] }
        ]
    },
    {
        label: 'Gestión de usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/pages/users'] }
        ]
    },
    {
        label: 'Proceso de titulación',
        items: [
            { label: 'Proyecto de Tesis', icon: 'pi pi-fw pi-file', routerLink: ['/pages/inscripciones'] },
            { label: 'Asesorías', icon: 'pi pi-fw pi-file-import', routerLink: ['/pages/asesorias'] },
            { label: 'Revisión de tesis', icon: 'pi pi-fw pi-file-export', routerLink: ['/pages/revision'] },
            { label: 'Sustentación', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/pages/sustentacion'] },
        ]
    },
    {
        label: 'SEMILLERO',
        items: [
            { label: 'Artículos', icon: 'pi pi-fw pi-book', routerLink: ['/pages/articulos-semilleros'] },
        ]
    },
    {
        label: 'Programa 3',
        items: [
            { label: 'Planes', icon: 'pi pi-fw pi-list-check', routerLink: ['/pages/planes'] },
            { label: 'Presupuestos', icon: 'pi pi-fw pi-calculator', routerLink: ['/pages/presupuestos'] },
        ]
    },
    {
        label: 'Eventos',
        items: [
            { label: 'Calendario', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/events'] },
        ]
    },
    {
        label: 'Reuniones UDI',
        items: [
            { label: 'Agenda UDI', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/agenda-udi'] },
        ]
    },
    {
        label: 'Líneas y Guías',
        items: [
            { label: 'Seguimiento', icon: 'pi pi-fw pi-file-check', routerLink: ['/pages/lineas-guias'] },
        ]
    },
    {
        label: 'Trámites',
        items: [
            { label: 'Seguimiento', icon: 'pi pi-fw pi-file-check', routerLink: ['/pages/tramites'] },
        ]
    },
];

export const teacherOptions = [
    {
        label: 'Proceso de titulación',
        items: [
            { label: 'Proyecto de Tesis', icon: 'pi pi-fw pi-file', routerLink: ['/pages/inscripciones'] },
            { label: 'Asesorías', icon: 'pi pi-fw pi-file-import', routerLink: ['/pages/asesorias'] },
            { label: 'Revisión de tesis', icon: 'pi pi-fw pi-file-export', routerLink: ['/pages/revision'] },
            { label: 'Sustentación', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/pages/sustentacion'] },
        ]
    },
    {
        label: 'Reuniones UDI',
        items: [
            { label: 'Agenda UDI', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/agenda-udi'] },
        ]
    },
    {
        label: 'Líneas y Guías',
        items: [
            { label: 'Seguimiento', icon: 'pi pi-fw pi-file-check', routerLink: ['/pages/lineas-guias'] },
        ]
    },
];