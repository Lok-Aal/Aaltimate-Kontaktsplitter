import { Component, Input } from '@angular/core'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Contact, Gender, InputError } from 'src/model/contact';
import { Form, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  providers: [MessageService],
})
export class ContactDialogComponent {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService ) { 
    this.error = config.data.error;
    this.errorRange = config.data.errorRange;
    this.originalString = config.data.originalString;

    this.name = new FormControl(config.data.contact.name, [Validators.required]);
    this.surname = new FormControl(config.data.contact.surname, [Validators.required]);
    this.titles = new FormControl(config.data.contact.titles.join(" "));
    this.gender = new FormControl(config.data.contact.gender, [Validators.required])

    if (config.data.error){
      this.markErrorString();
    }
  }

  name: FormControl;
  surname: FormControl;
  titles: FormControl;
  gender: FormControl;

  error: string;
  errorRange: InputError['input_error_range'];
  originalString: string;

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

  markErrorString(){

      const firstPart = this.originalString.slice(0, this.errorRange!.start);
      const secondPart = this.originalString.slice(this.errorRange!.start, this.errorRange!.end);
      const thirdPart = this.originalString.slice(this.errorRange!.end, this.originalString.length);

      this.originalString = `${firstPart}<span class='error'>${secondPart}</span>${thirdPart}`

  }


  validate(){
    this.name.markAsDirty();
    this.surname.markAsDirty();
    this.titles.markAsDirty();
    this.gender.markAsDirty();
    return (this.name.valid && this.surname.valid && this.titles.valid && this.gender.valid)

  }

  onSubmitContact(event: Event){
    event.preventDefault();

    const contactGender = (this.gender.value == '' ? undefined : this.gender.value) as Gender;

    if(!this.validate()){

      this.messageService.clear();
      this.messageService.add({severity:'error', detail: 'Bitte fülle alle Pflichtfelder aus', });

      return;
    }


    const contact:Contact = {
      gender: contactGender,
      name: this.name.value,
      surname: this.surname.value,
      titles: [this.titles.value]
    }
    this.ref.close(contact)
  }
  

}
