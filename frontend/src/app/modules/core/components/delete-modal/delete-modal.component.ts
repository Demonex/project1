import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    public displayedColumns: string[] = [];
    public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

    public showPreviewTable: boolean = false;

    ngOnInit(): void {
        this.displayedColumns = ['#', ...this.data.columns];
        this.dataSource.data = this.data.rowList;
    }

    public onDeleteClick(): void {
        this.dialogRef.close(true)
    }

    public onCancelClick(): void {
        this.dialogRef.close(false)
    }

}
