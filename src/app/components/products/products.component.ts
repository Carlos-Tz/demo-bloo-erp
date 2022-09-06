import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
//import { DataTableDirective } from 'angular-datatables';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
//import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit/* , OnDestroy */ {
  public dataSource = new MatTableDataSource<Product>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'name',
    'unit',
    'existence',
    'brand',
    'model',
    'avcost',
    'category',
    'proration',
    'class',
    'type',
    'rsco',
    'activeingredient',
    'doseacre',
    'periodreentry',
    'termreentry',
    'safetyinterval',
    'termsafetyinterval',
    'toxicologicalcategory',
    'blueberry',
    'strawberry',
    'raspberry',
    'blackberry',
    'action'
  ];
  //dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject<any> = new Subject<any>();
  //@ViewChild(DataTableDirective, { static: false })
  //dtElement!: DataTableDirective;
  public categories: Select2Data = [];
  //public value1: Select2Value = 'k4';
  public products: Product[] = [];
  public category = '';
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCategoryService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.apiC.GetCategoryList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const c = item.payload.val();
        const cat = {'value': c.id, 'label': c.name};        
        this.categories.push(cat);
      });
    });
    /* this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    }; */
    /* $.fn['dataTable'].ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = data[2] || ''; // use data for the id column
      if ( id ==  this.category || !this.category ) {
        return true;
      }
      return false;
    }); */

    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      this.products = [];
      data.forEach(item => {
        /* const f = item.payload.toJSON();
        f['$key'] = item.key;
        this.Orden.push(f as Orden); */
        const p = item.payload.val();     
        p['key'] = item.key;   
        //const pro = {'key': item.key, 'name': p.name, 'avcost': p.avcost, 'category': p.category, 'unit': p.unit, 'existence': p.existence, 'brand': p.brand, 'model': p.model };        
        this.products.push(p as Product);
      });
      if (this.products.length > 0) {
        this.data = true;
        this.dataSource.data = this.products.slice();
       /*  this.dataSource.sort = this.sort; */
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.trim().toLocaleLowerCase(), b.name.trim().toLocaleLowerCase(), isAsc);
        case 'category': return this.compare(a.category.trim().toLocaleLowerCase(), b.category.trim().toLocaleLowerCase(), isAsc);
        //case 'nombre': return this.compare(a.nombre.trim().toLocaleLowerCase(), b.nombre.trim().toLocaleLowerCase(), isAsc);
        //case 'fecha': return this.compare(a.fecha, b.fecha, isAsc);
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
    const dialogRef = this.dialog.open(NewProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: {
        key: key
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        /* this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('');
        }); */
      }
    });
  }

  openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este producto?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiP.DeleteProduct(key);
        this.toastr.info('Producto eliminado!');
        /* this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('');
        }); */
      }
    });
  }

  update(event: Select2UpdateEvent<any>) {
    this.category = event.value;
    /* this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    }); */
  }

  /* getAllProducts(){
    this.products = [];
    this.category = '';
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
          dtInstance.destroy();
      });
    }
    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();        
        //p['$key'] = item.key;
        const pro = {'key': item.key, 'name': p.name, 'avcost': p.avcost, 'category': p.category };        
        this.products.push(pro as Product);
      });
      this.dtTrigger.next('');
    });
  } */

  /* ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  } */
}
