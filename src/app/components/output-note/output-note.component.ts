import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiNoteService } from 'src/app/services/api-note.service';

@Component({
  selector: 'app-output-note',
  templateUrl: './output-note.component.html',
  styleUrls: ['./output-note.component.css']
})
export class OutputNoteComponent implements OnInit {

  public myForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiN: ApiNoteService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiN.GetNote(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.myForm.patchValue({ customer: data.customer.name });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [null],
      date: [''],
      customer: [''],
      status: [''],
      justification: [''],
      address: [''],
      city: [''],
      crops: [],
      products: [],
    });
  }
}
