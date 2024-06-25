import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OptimizationDto } from '../models/dto/optimization-dto.model'
import { FilterOptimizationDto } from '../models/dto/filters/filter-optimization-dto.model';

@Injectable({
    providedIn: 'root'
})
export class OptimizationService {

    private url = `${environment.baseUrl}/api/Dev`;

    constructor(private http: HttpClient) { }

    public getOptimizations(filters?: FilterOptimizationDto): Observable<OptimizationDto[]> {
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

        return this.http.get<OptimizationDto[]>(this.url, { params });
    }

    public getOptimization(id: number): Observable<OptimizationDto> {
        return this.http.get<OptimizationDto>(`${this.url}/${id}`);
    }

    public createOptimization(source: OptimizationDto) {
        return this.http.post<OptimizationDto>(this.url, source);
    }

    public deleteOptimization(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateOptimization(id: number, source: OptimizationDto): Observable<any> {
        return this.http.put<OptimizationDto>(`${this.url}/${id}`, source);
    }
}
