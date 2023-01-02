import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiCropService } from 'src/app/services/api-crop.service';

@Component({
  selector: 'app-edit-crop',
  templateUrl: './edit-crop.component.html',
  styleUrls: ['./edit-crop.component.css']
})
export class EditCropComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public api: ApiCropService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.api.GetCrop(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  submitSurveyData = () => {
    this.api.UpdateCrop(this.myForm.value, this.data.key);
    this.toastr.success('Cultivo actualizado!');

  }
}

