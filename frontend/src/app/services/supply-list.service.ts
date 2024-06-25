import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SupplyDto } from '../models/dto/supply-list-dto.model'
import { FilterSupplyDto } from '../models/dto/filters/filter-supply-dto.model';

@Injectable({
    providedIn: 'root'
})
export class SupplyListService {

    private url = `${environment.baseUrl}/api/Supply`;

    constructor(private http: HttpClient) { }

    public getSupplies(filters?: FilterSupplyDto): Observable<SupplyDto[]> {
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

        return this.http.get<SupplyDto[]>(this.url, { params });
    }

    public getSupply(id: number): Observable<SupplyDto> {
        return this.http.get<SupplyDto>(`${this.url}/${id}`);
    }

    public createSupply(source: SupplyDto) {
        return this.http.post<SupplyDto>(this.url, source);
    }

    public deleteSupply(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateSupply(id: number, source: SupplyDto): Observable<any> {
        return this.http.put<SupplyDto>(`${this.url}/${id}`, source);
    }
}
