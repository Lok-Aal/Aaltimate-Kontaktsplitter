import { Component, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { Contact, InputError } from 'src/model/contact';
import { ContactParserService } from './contact-parser.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]
})
export class AppComponent {

  ref: DynamicDialogRef | undefined;

  @Output() contacts: Contact[] = [];

  constructor(public dialogService: DialogService, private contactService: ContactParserService) { }

  showErrorDialog(error: InputError, originalString: string) {

    this.showDialog(error.partial_contact!, {
      error: error.error,
      errorRange: error.input_error_range,
      originalString: originalString
    });
  }

  showDialog(contact: Contact, otherData?: any) {
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
        this.contacts.push(contact);
        console.log(this.contacts);
      }
    });
  }

  onSubmitContact(contact: string) {
    console.log("received contact")
    this.contactService.parseContactString(contact).subscribe({
      next: (contact: Contact) => {
        this.showDialog(contact);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          const backendError: InputError = error.error;
          if(backendError.partial_contact){
            this.showErrorDialog(backendError, contact);
          }else{
            //TODO: Show error message
          }
        }
      }
    }
    );





  }



}
