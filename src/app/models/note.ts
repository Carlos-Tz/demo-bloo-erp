export interface Note {
    id: string;
    iva: number;
    subtotal: number;
    total: number;
    date: string;
    customer: string;
    status: number;
    justification: string;
    address: string;
    city: string;
    send: boolean;
    signed: boolean;
    complete: boolean;
    paymentdate: string;
    folio: number;
    paymenttype: string;
    orderdate: string;
    url_sign: string;
    date_sign: string;
    crops: [];
    products: [];
    balance: number;
    paidout: number;
    payments: [];
}
