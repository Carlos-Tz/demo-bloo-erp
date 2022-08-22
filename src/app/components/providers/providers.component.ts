import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Select2Data, Select2UpdateEvent, Select2Value } from 'ng-select2-component';
import { Subject } from 'rxjs';
import { Provider } from 'src/app/models/provider';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { NewProviderComponent } from '../new-provider/new-provider.component';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  public categories: Select2Data = [];
  //public value1: Select2Value = 'k4';
  public providers: Provider[] = [];
  public category = '';
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCategoryService,
    public apiP: ApiProviderService,
    ) { }

  ngOnInit(): void {
    this.apiC.GetCategoryList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const c = item.payload.val();
        const pro = {'value': c.id, 'label': c.name};        
        this.categories.push(pro);
      });
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };
    $.fn['dataTable'].ext.search.push((settings: any, data: string[], dataIndex: any) => {
      const id = data[3] || ''; // use data for the id column
      if ( id ==  this.category || !this.category ) {
        return true;
      }
      return false;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewProviderComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  update(event: Select2UpdateEvent<any>) {
    this.category = event.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  /* change(key: string, event: Event) {
    console.log(key, event);
  } */

  getAllProviders(){
    this.providers = [];
    this.category = '';
    if(this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
          dtInstance.destroy();
      });
    }
    this.apiP.GetProviderList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        const pro = {'id': p.id, 'name': p.name, 'phone': p.phone, 'category': p.category };        
        this.providers.push(pro as Provider);
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
