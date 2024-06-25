import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatterySupplyDto } from '../models/dto/client-supply-list-dto.model'
import { FilterBatterySupplyDto } from '../models/dto/filters/filter-client-supply-dto.model';

@Injectable({
    providedIn: 'root'
})
export class BatterySupplyListService {

    private url = `${environment.baseUrl}/api/BatterySupply`;

    constructor(private http: HttpClient) { }

    public getBatterySupplies(filters?: FilterBatterySupplyDto): Observable<BatterySupplyDto[]> {
        let params = new HttpParams();

        for (const filter in filters) {

            if (typeof filters[filter] === 'string') {
                params = params.append(`${filter}`, `${filters[filter]}`);
                continue;
            };

            (filters[filter] as Array<string>)?.forEach((value, index) => {
                params = params.append(`${filter}[${index}]`, `${value}`)
            });
        }

        return this.http.get<BatterySupplyDto[]>(this.url, { params });
    }

    public getBatterySupply(id: number): Observable<BatterySupplyDto> {
        return this.http.get<BatterySupplyDto>(`${this.url}/${id}`);
    }

    public createBatterySupply(source: BatterySupplyDto) {
        return this.http.post<BatterySupplyDto>(this.url, source);
    }

    public deleteBatterySupply(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateBatterySupply(id: number, source: BatterySupplyDto): Observable<any> {
        return this.http.put<BatterySupplyDto>(`${this.url}/${id}`, source);
    }
}
