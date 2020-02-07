export interface IDbEntity {
    key?: string;
}

export abstract class DbEntry<T> {
    public key: string;
    public value: T;

    constructor(json: { [key: string]: T }) {
        this.key = Object.getOwnPropertyNames(json)[0];
        this.value = json[this.key];
    }

    public getOutput(): T & IDbEntity {
        return {
            ...this.value,
            key: this.key,
        };
    }
}
