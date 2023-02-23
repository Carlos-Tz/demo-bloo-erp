import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { ApiCustomerService } from 'src/app/services/api-customer.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { NewCustomerComponent } from '../new-customer/new-customer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public dataSource = new MatTableDataSource<Customer>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'name',
    'phone',
    'email',
    'action'
  ];
  public customers: Customer[] = [];
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCustomerService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiC.GetCustomerList().snapshotChanges().subscribe(data => {
      this.customers = [];
      data.forEach(item => {
        const p = item.payload.val();        
        const cus = {'id': item.key, 'name': p.name, 'phone': p.phone, 'email': p.email };        
        this.customers.push(cus as Customer);
      });
      if (this.customers.length > 0) {
        this.data = true;
        this.dataSource.data = this.customers.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.customers.slice();
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
    const dialogRef = this.dialog.open(NewCustomerComponent, {
      width: '100%',
      maxWidth: '98%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      data: {
        key: key
      },
      width: '100%',
      maxWidth: '98%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este cliente?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiC.DeleteCustomer(key);
        this.toastr.info('Cliente eliminado!');
      }
    });
  }

}