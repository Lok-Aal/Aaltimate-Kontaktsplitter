import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-input',
  templateUrl: './contact-input.component.html',
  styleUrls: ['./contact-input.component.scss']
})
export class ContactInputComponent {

  contactString = new FormControl('', [Validators.required]);

  @Output() onContactSubmit: EventEmitter<{ contact: string, callback: VoidFunction }> = new EventEmitter<{ contact: string, callback: VoidFunction }>();

  onSubmit(event: Event){
    event.preventDefault();
    this.contactString.markAsTouched();
    this.contactString.markAsDirty();
    console.log(this.contactString.value, this.contactString.valid);
    if(this.contactString.valid){
      this.onContactSubmit.emit({contact:this.contactString.value!, callback: ()=>{
        this.contactString.reset();
      }});
    }
  }

}
