import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCicleService } from 'src/app/services/api-cicle.service';

@Component({
  selector: 'app-new-cicle',
  templateUrl: './new-cicle.component.html',
  styleUrls: ['./new-cicle.component.css']
})
export class NewCicleComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public api: ApiCicleService,
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
    this.api.AddCicle(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Ciclo guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
