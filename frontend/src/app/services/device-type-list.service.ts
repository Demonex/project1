import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceTypeDto } from '../models/dto/device-type-list-dto.model'
import { FilterDeviceTypeDto } from '../models/dto/filters/filter-device-type-dto.model';

@Injectable({
    providedIn: 'root'
})
export class DeviceTypeListService {

    private url = `${environment.baseUrl}/api/DeviceType`;

    constructor(private http: HttpClient) { }

    public getDeviceTypes(filters?: FilterDeviceTypeDto): Observable<DeviceTypeDto[]> {
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

        return this.http.get<DeviceTypeDto[]>(this.url, { params });
    }

    public getDeviceType(id: number): Observable<DeviceTypeDto> {
        return this.http.get<DeviceTypeDto>(`${this.url}/${id}`);
    }

    public createDeviceType(source: DeviceTypeDto) {
        return this.http.post<DeviceTypeDto>(this.url, source);
    }

    public deleteDeviceType(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public updateDeviceType(id: number, source: DeviceTypeDto): Observable<any> {
        return this.http.put<DeviceTypeDto>(`${this.url}/${id}`, source);
    }
}
