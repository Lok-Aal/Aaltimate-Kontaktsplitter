import { Component, Input } from '@angular/core'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Contact, Gender } from 'src/model/contact';
@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  providers: [MessageService],
})
export class ContactDialogComponent {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService ) { 
    this.gender = config.data.gender;  
    this.vorname = config.data.vorname;
    this.nachname = config.data.nachname;
    this.titles = config.data.titles;
  }

  @Input() gender: string;

  @Input() vorname: string;
  @Input() nachname: string;
  @Input() titles: string;

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


  validate(){
    
    return this.gender != '' && this.vorname != '' && this.nachname != ''

  }

  onSubmitContact(event: Event){
    event.preventDefault();

    const contactGender = (this.gender == '' ? undefined : this.gender) as Gender;

    if(!this.validate()){

      this.messageService.clear();
      this.messageService.add({severity:'error', summary: 'Fehler', detail: 'Es sind nicht alle Pflichtfelder ausgefüllt (Vorname, Nachname, Geschlecht)'});

      return;
    }


    const contact:Contact = {
      gender: contactGender,
      name: this.vorname,
      surname: this.nachname,
      titles: [this.titles]
    }
    this.ref.close(contact)
  }
  

}
