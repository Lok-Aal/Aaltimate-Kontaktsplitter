import { Component, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { Contact, InputError } from 'src/model/contact';
import { ContactParserService } from './contact-parser.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastServiceService } from './toast-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, ToastServiceService]
})
export class AppComponent {

  ref: DynamicDialogRef | undefined;

  @Output() contacts: Contact[] = [];

  constructor(public dialogService: DialogService, private contactService: ContactParserService, private notificationService: ToastServiceService) { }

  showErrorDialog(error: InputError, originalString: string) {

    this.showDialog(error.partial_contact!, ()=>{}, {
      error: error.error,
      hint: error.hint,
      errorRange: error.input_error_range,
      originalString: originalString
    });
  }

  showDialog(contact: Contact, callback: VoidFunction, otherData?: any) {
    this.ref = this.dialogService.open(ContactDialogComponent, {
      header: 'Kontakt vervollständigen',
      modal: true,
      width: '40%',
      data: {
        contact,
        ...otherData
      },
      closable: false,
    });

    this.ref.onClose.subscribe((contact: Contact) => {
      if (contact) {
        this.contacts = Array.from(new Set([...this.contacts, contact]));
      }
      callback();
    });
  }

  onEditContact(contact: Contact) {
    this.showDialog(contact, ()=>{
      this.contacts = this.contacts.filter((c) => c !== contact);
    });
  }

  onSubmitContact(event: { contact: string, callback: VoidFunction }) {
    console.log("received contact")
    this.contactService.parseContactString(event.contact).subscribe({
      next: (contact: Contact) => {
        this.showDialog(contact, event.callback);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          const backendError: InputError = error.error;
          if(backendError.partial_contact){
            this.showErrorDialog(backendError, event.contact);
          }else{
            this.notificationService.showError(backendError.error);
          }
        }
      }
    }
    );





  }



}
