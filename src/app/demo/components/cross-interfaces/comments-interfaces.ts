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