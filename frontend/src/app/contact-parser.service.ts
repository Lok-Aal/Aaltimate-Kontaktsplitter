import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';
import { AnredeRespone, Contact, Gender } from 'src/model/contact';

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

  getTitles(){
    const url = `${environment.scheme}://${environment.host}:${environment.port}${environment.endpoints.getTitles}`;
    return this.http.get<string[]>(url);
  }

  generateAnrede(contact: Contact){
    const url = `${environment.scheme}://${environment.host}:${environment.port}${environment.endpoints.generateAnrede}`;
    const params = new HttpParams()
    .set("name", contact.name ?? "")
    .set("surname", contact.surname ?? "")
    .set("titles", contact.titles?.join(",") ?? "")
    .set("gender", contact.gender ?? "")
    return this.http.get<AnredeRespone>(url, { params: params });
  }
}
