import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiCicleService } from 'src/app/services/api-cicle.service';

@Component({
  selector: 'app-edit-cicle',
  templateUrl: './edit-cicle.component.html',
  styleUrls: ['./edit-cicle.component.css']
})
export class EditCicleComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public api: ApiCicleService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.api.GetCicle(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      status: [null],
    });
  }

  submitSurveyData = () => {
    this.api.UpdateCicle(this.myForm.value, this.data.key);
    this.toastr.success('Ciclo actualizado!');

  }
}
