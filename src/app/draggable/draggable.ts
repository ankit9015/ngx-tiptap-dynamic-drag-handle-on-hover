import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { DOMSerializer } from '@tiptap/pm/model';

@Component({
  selector: 'editor-nodeview-draggable',
  templateUrl: './draggable.html',
  styleUrls: ['./draggable.scss'],
})
export class NodeviewDraggableItemComponent
  extends AngularNodeViewComponent
  implements OnInit
{
  content: string;

  ngOnInit(): void {
    const pos = this.getPos();
    const content = this.node.child(0);

    const [from, to] = [pos + 1, pos + content.nodeSize];
    this.content = this.sliceToHTML(this.editor.state.doc.slice(from, to));
    console.log(this.content);
  }

  sliceToHTML(slice) {
    const serializer = DOMSerializer.fromSchema(this.editor.schema);
    const fragment = serializer.serializeFragment(slice.content);
    const wrapper = document.createElement('div');
    wrapper.appendChild(fragment);
    return wrapper.innerHTML;
  }
}
