export interface Note {
    id: string;
    date: string;
    customer: string;
    status: number;
    justification: string;
    address: string;
    city: string;
    send: boolean;
    paymentdate: string;
    orderdate: string;
    crops: [];
    products: [];
}
