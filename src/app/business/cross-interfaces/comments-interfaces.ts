export interface IComment {
    userId: string,
    commentId: string,
    name: string,
    content: string,
    isComment: boolean,
    date: Date, 
}

export interface IStudent {
    code: string,
    email: string,
    id: number,
    name: string,
    phone: string,
    surnames: string,
}

export interface ITeacher {
    id: number,
    name: string,
    surnames: string,
    code: number,
    email: string,
    phone: number,
    orcid: string,
    cip: number
}