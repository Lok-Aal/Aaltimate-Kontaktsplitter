import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';
import { Contact, Gender } from 'src/model/contact';
@Injectable({
  providedIn: 'root'
})
export class ContactParserService {

  constructor(private http: HttpClient) { }

  parseContactString(contactString: string){
    const url = `${environment.scheme}://${environment.host}:${environment.port}${environment.endpoints.parse}`;
    const queryParams = { contact: contactString };
    return this.http.get<Contact>(url, { params: queryParams });
  }

  addTitle(title: string, gender?: Gender){
    const url = `${environment.scheme}://${environment.host}:${environment.port}${environment.endpoints.addTitle}`;
    return this.http.post(url, { title: title, gender: gender} );
  }
}
