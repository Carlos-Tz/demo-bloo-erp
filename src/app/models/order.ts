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
    unit: string;
    folio: number;
    paymentdate: string;
    paymenttype: string;
    status: number;
    balance: number;
    paidout: number;
    payments: [];
}
