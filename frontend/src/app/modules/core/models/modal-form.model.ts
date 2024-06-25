export interface ModalDataOut<T> {
    code?: number,
    row?: T;
    data?: T[];
    cache?: T;
}

export interface ModalDataIn<T> {
    row: T;
    edit: boolean;
    tableName?: string;
    component?: any;
    state?: string;
}

export interface DataValidate<T> {
    data: T;
    valid: boolean;
}