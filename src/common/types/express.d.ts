//purpose - to extend the express Request interface to include user information for each request

declare namespace Express {
    export interface Request {
       correlationId?: string; //? means optional
        user?: {
            userId: number;
            role: string;
            email: string;
        }
    }   
}