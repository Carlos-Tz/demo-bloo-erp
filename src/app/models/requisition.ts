export interface Requisition {
    id: string;
    folio: number;
    date: string;
    cicle: string;
    priority: number;
    status: number;
    justification: string;
    petitioner: string;
    products: [];
}
