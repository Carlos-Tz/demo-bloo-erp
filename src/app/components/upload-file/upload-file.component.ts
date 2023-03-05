import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from 'src/app/services/file-upload.service';
import 'fecha';
import fechaObj from 'fecha';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  private url = '';
  public myForm1!: FormGroup;
  public ord = 0;
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiF: FileUploadService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
    private helpS: HelpService
  ) { }

  ngOnInit(): void {
    this.url = this.helpS.GetUrl();
    this.sForm();
    this.apiF.GetLastFile().subscribe(res=> {
      if(res[0]){
        this.ord = Number(res[0].id);
        this.myForm1.patchValue({ id: this.ord + 1 });      
      } else {
        this.myForm1.patchValue({ id: 1 });      
      }
    });
  }

  sForm() {
    this.myForm1 = this.fb.group({
      id: [''],
      date: [''],
      customer: [''],
      url: [''],
      name: [''],
      crop: [''],
    });
  }

  get f(){
    return this.myForm.controls;
  }

  onFileChange(event:any) {
 
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  } 
   
  /**
   * Write code on Method
   *
   * @return response()
   */
  submit(){
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource')?.value);
      
    this.http.post(`${this.url}resources/upload_file.php`, formData)
      .subscribe(res => {
        if(res){
          //console.log(res);
          this.myForm1.patchValue({ 
            date: fechaObj.format(new Date(), 'YYYY[-]MM[-]DD'),
            name: this.myForm.get('name').value,
            url: `${this.url}files/${res}`,
            customer: this.data.id,
            crop: this.data.crop,
          });
          this.apiF.AddFile(this.myForm1.value);
          this.toastr.success('Documento cargado!');
        }
        //alert('Uploaded Successfully.');
      })
  }
}
