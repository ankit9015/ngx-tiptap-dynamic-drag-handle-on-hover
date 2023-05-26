import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import DraggableItemExtension from './draggable/drag.extension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  value = `<p>This is a boring paragraph.</p>

    <p>Followed by a fancy draggable item.</p>

  <p>This is a boring paragraph.</p>

    <p>And another draggable item.</p>


      <p>And a nested one.</p>

        <p>But can we go deeper?</p>

  <p>Let’s finish with a boring paragraph.</p>`;

  constructor(private injector: Injector) {}

  editor = new Editor({
    extensions: [
      StarterKit,
      Placeholder,
      DraggableItemExtension(this.injector),
    ],
    editorProps: {
      attributes: {
        class:
          'p-2 border-black focus:border-blue-700 border-2 rounded-md outline-none',
      },
    },
  });
}
