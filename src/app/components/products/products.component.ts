import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
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
export class ProductsComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };
    $.fn['dataTable'].ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = data[2] || ''; // use data for the id column
      if ( id ==  this.category || !this.category ) {
        return true;
      }
      return false;
    });
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('');
        });
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('');
        });
      }
    });
  }

  update(event: Select2UpdateEvent<any>) {
    this.category = event.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  getAllProducts(){
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
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }
}
