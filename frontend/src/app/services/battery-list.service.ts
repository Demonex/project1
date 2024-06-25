import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatteryDto } from '../models/dto/battery-list-dto.model'
import { FilterBatteryDto } from '../models/dto/filters/filter-battery-dto.model';

@Injectable({
    providedIn: 'root'
})
export class BatteryListService {

    private url = `${environment.baseUrl}/api/Battery`;

    constructor(private http: HttpClient) { }

    public getBatteries(filters?: FilterBatteryDto): Observable<BatteryDto[]> {
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

        return this.http.get<BatteryDto[]>(this.url, { params });
    }

    public getBattery(id: number): Observable<BatteryDto> {
        return this.http.get<BatteryDto>(`${this.url}/${id}`);
    }

    public createBattery(source: BatteryDto) {
        return this.http.post<BatteryDto>(this.url, source);
    }

    public deleteBattery(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateBattery(id: number, source: BatteryDto): Observable<any> {
        return this.http.put<BatteryDto>(`${this.url}/${id}`, source);
    }
}
