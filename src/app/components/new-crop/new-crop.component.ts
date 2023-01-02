import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCropService } from 'src/app/services/api-crop.service';

@Component({
  selector: 'app-new-crop',
  templateUrl: './new-crop.component.html',
  styleUrls: ['./new-crop.component.css']
})
export class NewCropComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public api: ApiCropService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    //this.api.GetCategoryList();
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  submitSurveyData = () => {
    this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    this.api.AddCrop(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Cultivo guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
