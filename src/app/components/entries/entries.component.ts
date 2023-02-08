import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Movement } from 'src/app/models/movement';
import { ApiMovementService } from 'src/app/services/api-movement.service';
import 'fecha';
import fechaObj from 'fecha';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {

  public dataSource = new MatTableDataSource<Movement>();
  public movements: Movement[] = [];
  public data = false;
  public myForm!: FormGroup;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'date',
    'name_prod',
    /* 'orderdate', */
    'price',
    /* 'provider', */
    /* 'iva',*/
    'quantity',
    'type',
    /* 'balance', */
    /* 'key_r', */
    /* 'action', */
  ];
  constructor(
    private fb: FormBuilder,
    public apiM: ApiMovementService
  ) { }

  ngOnInit(): void {
    this.sForm();

  }

  sForm() {
    this.myForm = this.fb.group({
      initial_date: ['', [Validators.required]],
      final_date: ['', [Validators.required]],
      orders: [],
      //providers: [],
    }, {validator: this.dateLessThan('initial_date', 'final_date')});
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
     let f = group.controls[from];
     let t = group.controls[to];
     if (f.value > t.value) {
       return {
         dates: "La fecha inicial debe ser menor a la fecha final!."
       };
     }
     return {};
    }
  }

  submitSurveyData() {
    this.apiM.GetMovementList().snapshotChanges().subscribe(data => {
      this.movements = [];
      data.forEach(item => {
        const m = item.payload.val();
        if(m.type == 'ENTRADA' && m.date >= this.myForm.get('initial_date').value && m.date <= this.myForm.get('final_date').value){
          this.movements.push(m as Movement);
        }
      });
      if (this.movements.length > 0) {
        this.data = true;
        this.dataSource.data = this.movements.reverse().slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  ResetForm() {
    this.myForm.reset();
  }

  sortData(sort: Sort) {
    const data = this.movements.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
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
}
