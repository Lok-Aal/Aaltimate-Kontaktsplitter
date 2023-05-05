import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddTitleDialogComponent } from '../add-title-dialog/add-title-dialog.component';
import { ContactParserService } from '../contact-parser.service';
import { Gender } from 'src/model/contact';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-title-list',
  templateUrl: './title-list.component.html',
  styleUrls: ['./title-list.component.scss']
})
export class TitleListComponent {

  titles: string[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService, private contactService: ContactParserService, private notificationService: ToastServiceService) { }

  onAddTitle(){
    this.showDialog();
  }

  showDialog() {
    this.ref = this.dialogService.open(AddTitleDialogComponent, {
      width: '40%',
      header: 'Titel hinzufügen',
      modal: true,
      closable: false,
    });

    this.ref.onClose.subscribe(({title, gender}) => {
      this.contactService.addTitle(title, gender).subscribe({
        next: (_) => {
          this.titles = Array.from(new Set([...this.titles, title]));
        },
        error: (error: any) => {
          this.notificationService.showError(error); 
        }
    }); 
  });

}
  
}
