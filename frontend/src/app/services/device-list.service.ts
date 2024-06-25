import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceDto } from '../models/dto/device-list-dto.model'
import { FilterDeviceDto } from '../models/dto/filters/filter-device-dto.model';

@Injectable({
    providedIn: 'root'
})
export class DeviceListService {

    private url = `${environment.baseUrl}/api/Device`;

    constructor(private http: HttpClient) { }

    public saveFile(file: File): Observable<any> {
        const formData: FormData = new FormData();

        formData.append('File', file, file.name);
        return this.http.post(this.url + "/file", formData);
    }

    public getDevices(filters?: FilterDeviceDto): Observable<DeviceDto[]> {
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

        return this.http.get<DeviceDto[]>(this.url, { params });
    }

    public getDevice(id: number): Observable<DeviceDto> {
        return this.http.get<DeviceDto>(`${this.url}/${id}`);
    }

    public createDevice(source: DeviceDto): Observable<DeviceDto> {
        return this.http.post<DeviceDto>(this.url, source);
    }

    public deleteDevice(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

    public deleteDevices(ids: number[]) {

        let params = new HttpParams();

        ids.forEach((elem: number, index: number) => {
            params = params.append(`ids[${index}]`, elem);
        });

        return this.http.delete(`${this.url}/deleteSome`, { params: params });
    }

    public updateDevice(id: number, source: DeviceDto): Observable<any> {
        return this.http.put<DeviceDto>(`${this.url}/${id}`, source);
    }
}
