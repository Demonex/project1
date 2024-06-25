import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[DropZone]'
})
export class DropZoneDirective {

    @Output() readonly dropped: EventEmitter<File> = new EventEmitter();
    @Output() readonly hovered: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    @HostListener('drop', ['$event'])
    onDrop($event) {
        $event.preventDefault();
        this.dropped.emit($event.dataTransfer.files[0])
        this.hovered.emit(false);
    }

    @HostListener('dragover', ['$event'])
    onDragOver($event) {
        $event.preventDefault();
        this.hovered.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave($event) {
        $event.preventDefault();
        this.hovered.emit(false);
    }
}
