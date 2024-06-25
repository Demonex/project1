import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ControllerDto } from '../models/dto/controller-list-dto.model'
import { FilterControllerDto } from '../models/dto/filters/filter-controller-dto.model';

@Injectable({
    providedIn: 'root'
})
export class ControllerListService {

    private url = `${environment.baseUrl}/api/Charge`;

    constructor(private http: HttpClient) { }

    public getControllers(filters?: FilterControllerDto): Observable<ControllerDto[]> {
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

        return this.http.get<ControllerDto[]>(this.url, { params });
    }

    public getController(id: number): Observable<ControllerDto> {
        return this.http.get<ControllerDto>(`${this.url}/${id}`);
    }

    public createController(source: ControllerDto) {
        return this.http.post<ControllerDto>(this.url, source);
    }

    public deleteController(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateController(id: number, source: ControllerDto): Observable<any> {
        return this.http.put<ControllerDto>(`${this.url}/${id}`, source);
    }
}
