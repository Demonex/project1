export interface PanelDto {
    id?: number;
    name?: string;
    type?: string;
    watt?: number;
    volt?: number;
    voltoc?: number;
    amper?: number;
    eff?: number;
    size?: number;
    price?: number;
}

interface Panel {
    eff?: number;
    size?: number;
    price?: number;
    
}
