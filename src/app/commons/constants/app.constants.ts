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


