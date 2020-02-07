import { ISlot } from './Slot';

export interface IDomain {
    // Explicit domain name
    domain: string;
    // Available slots for the domain
    slots?: { [key: string]: ISlot };
}

export interface IDbDomain {
    key: string;
    value: IDomain;
}
