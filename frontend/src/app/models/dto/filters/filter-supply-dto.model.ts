export interface FilterSupplyDto {
    names: string[];
    startDates: string[];
    endDates: string[];
    contracts: string[];
    state?: string;
}