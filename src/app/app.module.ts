import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxTiptapModule } from 'ngx-tiptap';

import { AppComponent } from './app.component';
import { NodeviewDraggableItemComponent } from './draggable/draggable';

@NgModule({
  imports: [BrowserModule, FormsModule, NgxTiptapModule],
  declarations: [AppComponent, NodeviewDraggableItemComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
