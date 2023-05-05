import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnredeRespone, Contact } from 'src/model/contact';
import { ToastServiceService } from '../toast-service.service';
@Component({
  selector: 'app-formatted-string-dialog',
  templateUrl: './formatted-string-dialog.component.html',
  styleUrls: ['./formatted-string-dialog.component.scss']
})
export class FormattedStringDialogComponent {
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private toastService: ToastServiceService) {

  }

  contact: Contact = this.config.data.contact;
  anreden: AnredeRespone = this.config.data.anreden;
  formality: FormControl<keyof AnredeRespone | null> = new FormControl("neutral" as keyof AnredeRespone);


  getCurrentAnrede(){
    return this.anreden[this.formality.value as keyof AnredeRespone];
  }

  async copyToClipboard(text: string) {
    if(text == null){
      return;
    }
    await navigator.clipboard.writeText(text).then().catch();
    this.toastService.showSuccess("In Zwischenablage kopiert");

  }

  formalityOptions : {label:string, value: keyof AnredeRespone}[] = [
    {
      label: "Formell",
      value: "formal" 
    },
    {
      label: "Informell",
      value: "informal"
    },
    {
      label: "Neutral",
      value: "neutral"
    }
  ]
}
