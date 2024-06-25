import { Pipe, PipeTransform } from '@angular/core';

const dictionary = {
    "id": "id",
    "name": "Название",
    "orderCode": "Код заказа",
    "comment": "Комментарий",
    "description": "Описание",
    "startDate": "Дата начала",
    "endDate": "Дата окончания",
    "year": "Год",
    "supplyCodeName": "Код поставки",
    "code": "Код",
    "panelName": "Название поставщика",
    "supplyName": "Название поставки",
    "deviceName": "Название девайса",
    "contractName": "Название контракта",
    "batteryName": "Имя клиента",
    "deviceTypeName": "Название типа девайса",
    "controllerName": "Название системы",
    "startTime": "Время начала",
    "duration": "Длительность (ч)",
    "watt": "Мощность (Вт)",
    "volt": "Напряжение (В)",
    "voltoc": "Напряжение холостого хода (В)",
    "amper": "Сила тока (А)",
    "eff": "КПД",
    "size": "Площадь (м2)",
    "price": "Стоимость",
    "type": "Тип",
    "cap": "Емкость (А*ч)",
    "bound": "Порог разряда",
    "mwatt": "Макс. мощность (Вт)",
    "mvolt": "Макс. наряжение (В)",
    "mamper": "Макс. сила тока (А)",
    "voltmod": "Напряжение системы (В)",
    "amount": "Количество",

};

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): string {
        return dictionary[value];
    }

}
