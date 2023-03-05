import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiCompanyService } from 'src/app/services/api-company.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  private url='';
  public myForm!: FormGroup;
  public name = '';
  public file: any;
  public image;
  constructor(
    private fb: FormBuilder,
    public api: ApiCompanyService,
    private http: HttpClient,
    public toastr: ToastrService,
    private helpS: HelpService
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.url = this.helpS.GetUrl();
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

  changeListener(event: any): void {
    if (event.target.files.length > 0) {
      const ima = event.target.files[0];
      this.file = ima;
      //this.readThis($event.target);
      const myReader: FileReader = new FileReader();
      myReader.readAsDataURL(ima);
      myReader.onload = (e) => {
        this.image = myReader.result;
        //this.myForm.patchValue({ 'logo' : this.image});
        /* this.element.avatar = <string>myReader.result; */
        //console.log(myReader.result);
        //console.log(this.image);
      //  container.style.backgroundImage = `url(${myReader.result})`;
      };
    }
  }

  submitSurveyData = () => {
    const formData = new FormData();
    formData.append('file', this.file);
      
    this.http.post(`${this.url}resources/upload_logo.php`, formData)
      .subscribe(res => {
        if(res){
          //console.log(res);
          this.myForm.patchValue({ logo: `${this.url}resources/${res}` });
        }else {
          this.myForm.patchValue({ logo: '' });
        }
        this.myForm.patchValue({ 'name' : (this.myForm.get('name')?.value).toUpperCase() });
        this.myForm.patchValue({ 'rfc' : (this.myForm.get('rfc')?.value).toUpperCase() });
        this.myForm.patchValue({ 'address' : (this.myForm.get('address')?.value).toUpperCase() });
        this.api.UpdateCompary(this.myForm.value);
        this.toastr.success('Datos guardados!');
      })
  }
}
