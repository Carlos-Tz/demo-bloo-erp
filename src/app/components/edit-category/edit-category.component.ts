import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public api: ApiCategoryService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.api.GetCategory(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  submitSurveyData = () => {
    this.api.UpdateCategory(this.myForm.value, this.data.key);
    this.toastr.success('Clasificación actualizada!');

  }
}
