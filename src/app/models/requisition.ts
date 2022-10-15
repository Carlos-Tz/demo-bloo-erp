export interface Requisition {
    id: string;
    date: string;
    cicle: string;
    priority: number;
    status: number;
    justification: string;
    petitioner: string;
    comments: string;
    authorizationdate: string;
    products: [];
    quotations: [];
    orders: [];
}
