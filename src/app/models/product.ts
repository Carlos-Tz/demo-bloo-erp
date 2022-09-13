export interface Product {
    id: string;
    name: string;
    brand: string;
    model: string;
    unit: number;
    avcost: number;
    existence: number;
    category: string;
    proration: boolean;
    class: string;
    type: string;
    rsco: string;
    activeingredient: string;
    doseacre: number;
    periodreentry: number;
    termreentry: string;
    safetyinterval: number;
    termsafetyinterval: string;
    toxicologicalcategory: string;
    blueberry: boolean;
    strawberry: boolean;
    raspberry: boolean;
    blackberry: boolean;
    providers: string[];
}
