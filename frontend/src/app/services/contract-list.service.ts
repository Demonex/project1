import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContractDto } from '../models/dto/contract-list-dto.model'
import { FilterContractDto } from '../models/dto/filters/filter-contract-dto.model';

@Injectable({
    providedIn: 'root'
})
export class ContractListService {

    private url = `${environment.baseUrl}/api/Contract`;

    constructor(private http: HttpClient) { }

    public getContracts(filters?: FilterContractDto): Observable<ContractDto[]> {
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

        return this.http.get<ContractDto[]>(this.url, { params });
    }

    public getContract(id: number): Observable<ContractDto> {
        return this.http.get<ContractDto>(`${this.url}/${id}`);
    }

    public createContract(source: ContractDto) {
        return this.http.post<ContractDto>(this.url, source);
    }

    public deleteContract(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateContract(id: number, source: ContractDto): Observable<any> {
        return this.http.put<ContractDto>(`${this.url}/${id}`, source);
    }
}
