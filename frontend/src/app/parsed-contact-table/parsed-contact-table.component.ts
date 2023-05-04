import { Component, Input } from '@angular/core';
import { Contact } from 'src/model/contact';

@Component({
  selector: 'app-parsed-contact-table',
  templateUrl: './parsed-contact-table.component.html',
  styleUrls: ['./parsed-contact-table.component.scss']
})
export class ParsedContactTableComponent {


  @Input() contacts: Contact[] = [];


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
