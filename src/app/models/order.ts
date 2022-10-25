export interface Order {
    avcost: number;
    id: number;
    iva: number;
    key: string;
    key_r: string;
    name: string;
    orderdate: string;
    price: number;
    provider: string;
    quantity: number;
    quantity_received: number;
    quantity_remaining: number;
    unit: string;
    folio: number;
    paymentdate: string;
    paymenttype: string;
    status: number;
    status_reception: number;
    cicle: string;
    category: string;
    balance: number;
    paidout: number;
    payments: [];
}
