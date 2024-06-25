import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvertorDto } from '../models/dto/invertor-list-dto.model'
import { FilterInvertorDto } from '../models/dto/filters/filter-invertor-dto.model'


@Injectable({
    providedIn: 'root'
})
export class InvertorListService {

    private url = `${environment.baseUrl}/api/Invertor`;

    constructor(private http: HttpClient) { }

    public getInvertors(filters?: FilterInvertorDto): Observable<InvertorDto[]> {
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

        return this.http.get<InvertorDto[]>(this.url, { params });
    }

    public getInvertor(id: number): Observable<InvertorDto> {
        return this.http.get<InvertorDto>(`${this.url}/${id}`);
    }

    public createInvertor(source: InvertorDto) {
        return this.http.post<InvertorDto>(this.url, source);
    }

    public deleteInvertor(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateInvertor(id: number, source: InvertorDto): Observable<any> {
        return this.http.put<InvertorDto>(`${this.url}/${id}`, source);
    }
}
