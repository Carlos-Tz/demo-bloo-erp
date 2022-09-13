import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';

@Component({
  selector: 'app-new-ranch',
  templateUrl: './new-ranch.component.html',
  styleUrls: ['./new-ranch.component.css']
})
export class NewRanchComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public api: ApiRanchService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    //this.api.GetCategoryList();
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      status: [true],
    });
  }

  submitSurveyData = () => {
    this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    this.api.AddRanch(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Rancho guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
