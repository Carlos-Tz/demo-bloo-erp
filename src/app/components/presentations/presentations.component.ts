import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Presentation } from 'src/app/models/presentation';
import { ApiPresentationService } from 'src/app/services/api-presentation.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditPresentationComponent } from '../edit-presentation/edit-presentation.component';
import { NewPresentationComponent } from '../new-presentation/new-presentation.component';
declare var window: any;

@Component({
  selector: 'app-presentations',
  templateUrl: './presentations.component.html',
  styleUrls: ['./presentations.component.css']
})
export class PresentationsComponent implements OnInit {
  public dataSource = new MatTableDataSource<Presentation>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'name',
    'description',
    'action'
  ];
  public categories: Presentation[] = [];
  constructor(
    public dialog: MatDialog,
    public apiP: ApiPresentationService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiP.GetPresentationList().snapshotChanges().subscribe(data => {
      this.categories = [];
      data.forEach(item => {
        const c = item.payload.val();        
        const cat = {'id': item.key, 'name': c.name, 'description': c.description };        
        this.categories.push(cat as Presentation);
      });
      if (this.categories.length > 0) {
        this.data = true;
        this.dataSource.data = this.categories.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.categories.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.trim().toLocaleLowerCase(), b.name.trim().toLocaleLowerCase(), isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public doFilter = (event: any) => {
    this.dataSource.filter = event.value.trim().toLocaleLowerCase();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewPresentationComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditPresentationComponent, {
      data: {
        key: key
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar esta clasificación?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiP.DeletePresentation(key);
        this.toastr.info('Clasificación eliminada!');
      }
    });
  }

}
