import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PanelDto } from '../models/dto/panel-list-dto.model'
import { FilterPanelDto } from '../models/dto/filters/filter-panel-dto.model';

@Injectable({
    providedIn: 'root'
})
export class PanelListService {

    private url = `${environment.baseUrl}/api/Panel`;

    constructor(private http: HttpClient) { }

    public getPanels(filters?: FilterPanelDto): Observable<PanelDto[]> {
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

        return this.http.get<PanelDto[]>(this.url, { params });
    }

    public getPanel(id: number): Observable<PanelDto> {
        return this.http.get<PanelDto>(`${this.url}/${id}`);
    }

    public createPanel(source: PanelDto) {
        return this.http.post<PanelDto>(this.url, source);
    }

    public deletePanel(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updatePanel(id: number, source: PanelDto): Observable<any> {
        return this.http.put<PanelDto>(`${this.url}/${id}`, source);
    }
}
