import { Sector } from "./sector";

export interface Ranch {
    id: string;
    status: boolean;
    sectors: Sector[];
}
