import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Sector } from 'src/app/models/sector';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    public dialog: MatDialog,
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
      if(data.sectors){
        for (const e in data.sectors) {
          if (Object.prototype.hasOwnProperty.call(data.sectors, e)) {
            const element = data.sectors[e];
            this.sectors.push(element);
          }
        }
      }
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
    this.myForm.patchValue({ 'sectors': [] });
    this.api.UpdateRanch(this.myForm.value, this.data.key);
    this.sectors.forEach(el => this.api.AddSector(this.data.key, el));
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

    const index = this.sectors.findIndex((object) => {
      return object.id === this.myForm1.get('name').value;
    });
    
    if (index !== -1) {
      this.sectors = this.sectors.map(se => se.id !== s.id ? se : s);
    }else {
      this.sectors.push(s);
    }

    console.log(this.sectors);
    
    this.myForm1.reset();
    this.myForm1.patchValue({ 'id_ranch': this.data.key });
  }

  editSec(sec: Sector){
    this.myForm1.patchValue(sec);
  }

  /* deleteSec(id: string){
    const index = this.sectors.findIndex((object) => {
      return object.id === id;
    });
    
    if (index !== -1) {
      this.sectors.splice(index, 1);
    }
  } */

  openDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este sector?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const index = this.sectors.findIndex((object) => {
          return object.id === id;
        });
        
        if (index !== -1) {
          this.sectors.splice(index, 1);
        }
      }
    });
  }
}
