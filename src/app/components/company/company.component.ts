import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCompanyService } from 'src/app/services/api-company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public myForm!: FormGroup;
  public name = '';
  public image;
  constructor(
    private fb: FormBuilder,
    public api: ApiCompanyService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.api.GetCompany().valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      if(data.logo){
        this.image = data.logo;
      }
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['company_id'],
      name: [''],
      rfc: ['', [Validators.maxLength(13), Validators.minLength(12)]],
      address: [''],
      logo: [''],
      business_name: [''],
      email: [''],
      tel: [''],
    });
  }

  changeListener($event): void {
    const ima = $event.target.files[0];
    //this.readThis($event.target);
    const myReader: FileReader = new FileReader();
    myReader.readAsDataURL(ima);
    myReader.onload = (e) => {
      this.image = myReader.result;
      this.myForm.patchValue({ 'logo' : this.image});
      /* this.element.avatar = <string>myReader.result; */
      //console.log(myReader.result);
      //console.log(this.image);
    //  container.style.backgroundImage = `url(${myReader.result})`;
    };
  }

  submitSurveyData = () => {
    this.myForm.patchValue({ 'name' : (this.myForm.get('name')?.value).toUpperCase() });
    this.myForm.patchValue({ 'rfc' : (this.myForm.get('rfc')?.value).toUpperCase() });
    this.myForm.patchValue({ 'address' : (this.myForm.get('address')?.value).toUpperCase() });
    this.api.UpdateCompary(this.myForm.value);
    this.toastr.success('Datos guardados!');
  }
}
