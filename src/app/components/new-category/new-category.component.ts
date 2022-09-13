import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public api: ApiCategoryService,
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
      description: ['', [Validators.required]],
    });
  }

  submitSurveyData = () => {
    this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    this.api.AddCategory(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Clasificación guardada!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
