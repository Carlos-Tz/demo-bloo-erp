import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-charge',
  templateUrl: './view-charge.component.html',
  styleUrls: ['./view-charge.component.css']
})
export class ViewChargeComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
