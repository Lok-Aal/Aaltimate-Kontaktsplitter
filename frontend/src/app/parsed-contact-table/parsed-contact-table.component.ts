import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnredeRespone, Contact } from 'src/model/contact';
import { ContactParserService } from '../contact-parser.service';
import { FormattedStringDialogComponent } from '../formatted-string-dialog/formatted-string-dialog.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-parsed-contact-table',
  templateUrl: './parsed-contact-table.component.html',
  styleUrls: ['./parsed-contact-table.component.scss']
})
export class ParsedContactTableComponent {


  constructor(public dialogService: DialogService, private contactService: ContactParserService, private confirmationService: ConfirmationService) { 

  }
  ref: DynamicDialogRef | undefined;
  @Input() contacts: Contact[] = [];
  @Output() onEditContact: EventEmitter<Contact> = new EventEmitter<Contact>();
  
  editContact(contact: Contact){
    this.onEditContact.emit(contact);
  } 

  deleteContact(contact: Contact, event: Event){

    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie den Kontakt löschen wollen?',
      header: 'Kontakt löschen',
      icon: 'pi pi-exclamation-triangle',
      target: event.target!,
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      accept: () => {
        this.contacts = this.contacts.filter((c) => c !== contact);
      },
      reject: () => {}
    });
  }

  generateEmail(contact: Contact){
    this.contactService.generateAnrede(contact).subscribe((anreden: AnredeRespone) => {
      this.ref = this.dialogService.open(FormattedStringDialogComponent, {
        header: 'Anrede generieren',
        modal: false,
        width: '30%',
        data: {
          contact,
          anreden
        },
      });
      
    });
  }

  getGenderString(gender: string){

    switch(gender){
      case "m":
        return "Männlich";
      case "w":
        return "Weiblich";
      case "d":
        return "Divers";
      default:
        return "Divers";
    }

  }
}
