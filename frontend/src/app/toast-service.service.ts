import { Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class ToastServiceService {

  constructor(private zone: NgZone, private messageService: MessageService) {
      
   }

    showSuccess(message: string) {
        this.zone.run(() => {
            this.messageService.add({severity:'success',detail: message});
        });
    }

    showError(message: string) {
        this.zone.run(() => {
            this.messageService.add({summary:"Fehler",severity:'error',detail: message});
        });
    }
}
