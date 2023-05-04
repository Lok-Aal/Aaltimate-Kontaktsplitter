import { Component, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { Contact } from 'src/model/contact';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[DialogService]
})
export class AppComponent {

  ref: DynamicDialogRef | undefined;

  @Output() contacts: Contact[] = [];

  constructor(public dialogService: DialogService) {}

  showDialog() {
      this.ref = this.dialogService.open(ContactDialogComponent, {
          header: 'Kontakt vervollständigen',
          modal: true,
          width: '40%',
          data: {
            vorname: "rapha",
            nachname: "sack",
            gender: "m",
          },
          closable: false,
      });

      this.ref.onClose.subscribe((contact: Contact) => {
        if(contact){ 
          this.contacts.push(contact);
          console.log(this.contacts);
        }
      });
  }

  onSubmitContact(contact: string){
    console.log("received contact")
    this.showDialog();
  }


  
}
