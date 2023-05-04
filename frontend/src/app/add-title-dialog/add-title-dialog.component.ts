import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Gender } from 'src/model/contact';

@Component({
  selector: 'app-add-title-dialog',
  templateUrl: './add-title-dialog.component.html',
  styleUrls: ['./add-title-dialog.component.scss']
})
export class AddTitleDialogComponent {


  constructor(public ref: DynamicDialogRef) {
  
    this.gender = new FormControl('');
    this.title = new FormControl('', [Validators.required]);
  }

  gender: FormControl;
  title: FormControl;

  genderOptions: any[] = [
    {
      label: "Männlich",
      value: 'm'
    },
    {
      label: "Weiblich",
      value: 'w'
    },
    {
      label: "Divers",
      value: 'd'
    }
  ]

  onTitleSubmit(event:Event){
    event.preventDefault();
    this.title.markAsDirty();
    if(this.title.valid){
      this.ref.close({title: this.title.value!, gender: (this.gender.value != "" ? this.gender.value : undefined) as Gender | undefined});
    }
  }

}
