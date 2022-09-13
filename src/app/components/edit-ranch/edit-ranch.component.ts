import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';

@Component({
  selector: 'app-edit-ranch',
  templateUrl: './edit-ranch.component.html',
  styleUrls: ['./edit-ranch.component.css']
})
export class EditRanchComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public api: ApiRanchService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.api.GetRanch(this.data.key).valueChanges().subscribe(data => {
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
    this.api.UpdateRanch(this.myForm.value, this.data.key);
    this.toastr.success('Rancho actualizado!');

  }
}
