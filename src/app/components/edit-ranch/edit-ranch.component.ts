import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';

@Component({
  selector: 'app-edit-ranch',
  templateUrl: './edit-ranch.component.html',
  styleUrls: ['./edit-ranch.component.css']
})
export class EditRanchComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public sectors: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public api: ApiRanchService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.sForm1();
    this.myForm1.patchValue({ 'id_ranch': this.data.key });
    this.api.GetRanch(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      status: [null],
      sectors: [],
    });
  }
  sForm1() {
    this.myForm1 = this.fb.group({
      id: [''],
      name: ['',[Validators.required]],
      hectares: ['', [Validators.required]],
      variety: [''],
      status: [''],
      id_ranch: ['', [Validators.required]]
    });
  }

  submitSurveyData = () => {
    this.api.UpdateRanch(this.myForm.value, this.data.key);
    this.toastr.success('Rancho actualizado!');
  }

  addSector(){
    const s = {
      'id': this.myForm1.get('name').value,
      'name': this.myForm1.get('name').value,
      'hectares': this.myForm1.get('hectares').value,
      'variety': '',
      'status': true,
      'id_ranch': this.myForm1.get('id_ranch').value,
    };
    this.sectors.push(s); console.log(this.sectors);
    
    this.myForm1.reset();
    this.myForm1.patchValue({ 'id_ranch': this.data.key });
  }

  editSec(key: string, quantity: number){
    this.myForm1.patchValue({ product: key , quantity: quantity})
  }

  deleteSec(key: string){
    const index = this.sectors.findIndex((object) => {
      return object.key === key;
    });
    
    if (index !== -1) {
      this.sectors.splice(index, 1);
    }
  }
}
