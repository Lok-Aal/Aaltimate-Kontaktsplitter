import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { Button, ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactInputComponent } from './contact-input/contact-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ParsedContactTableComponent } from './parsed-contact-table/parsed-contact-table.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import {MessageModule } from 'primeng/message';
import { TitleListComponent } from './title-list/title-list.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { AddTitleDialogComponent } from './add-title-dialog/add-title-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    ContactInputComponent,
    ParsedContactTableComponent,
    TitleListComponent,
    ContactDialogComponent,
    AddTitleDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CardModule, InputTextModule, CheckboxModule, RadioButtonModule, ButtonModule, 
    HttpClientModule,
    ReactiveFormsModule,
    MessageModule,
    MessagesModule,
    SelectButtonModule,
    FormsModule,
    DynamicDialogModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
