import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiPresentationService } from 'src/app/services/api-presentation.service';

@Component({
  selector: 'app-new-presentation',
  templateUrl: './new-presentation.component.html',
  styleUrls: ['./new-presentation.component.css']
})
export class NewPresentationComponent implements OnInit {

  public myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public api: ApiPresentationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    //this.api.GetPresentationList();
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
    this.api.AddPresentation(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Presentación guardada!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
