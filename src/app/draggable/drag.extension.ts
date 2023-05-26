import { Injector } from '@angular/core';
import { Node, mergeAttributes } from '@tiptap/core';
import { AngularNodeViewRenderer } from 'ngx-tiptap';

import { NodeviewDraggableItemComponent } from './draggable';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DOMSerializer } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

const DraggableItemExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'draggableItem',
    priority: 1000,

    group: 'block',

    content: 'block+',

    draggable: true,

    parseHTML() {
      return [{ tag: 'div[data-type="draggable-item"]' }];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-item' }),
        0,
      ];
    },
    addNodeView() {
      return AngularNodeViewRenderer(NodeviewDraggableItemComponent, {
        injector,
      });
    },

    addProseMirrorPlugins() {
      const editor = this.editor;
      const pluginKey = new PluginKey('dBlockPlugin');

      // Convert a ProseMirror Slice to HTML string
      function sliceToHTML(slice) {
        const serializer = DOMSerializer.fromSchema(editor.schema);
        const fragment = serializer.serializeFragment(slice.content);
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        return wrapper.innerHTML;
      }

      function getPos(view: EditorView, { target }) {
        const pos = view.posAtDOM(target, 0);
        const { doc } = view.state;
        const re = doc.resolve(pos);
        return { from: re.before(), to: re.after() };
      }
      return [
        new Plugin({
          key: pluginKey,
          props: {
            handleDOMEvents: {
              mouseover(view, event) {
                event.preventDefault();
                if (
                  (event.target as HTMLElement).className.includes(
                    'ProseMirror'
                  )
                )
                  return;
                const { from, to } = getPos(view, event);
                const node = view.state.doc.nodeAt(from);
                const parent_node = view.state.doc.resolve(from).parent;
                if (
                  node.type.name == 'draggableItem' ||
                  parent_node.type.name == 'draggableItem'
                ) {
                  return;
                }

                const contentHtml = sliceToHTML(view.state.doc.slice(from, to));

                const wrappedContent = `<div data-type="draggable-item">${contentHtml}</div>`;

                editor.commands.insertContentAt({ from, to }, wrappedContent, {
                    updateSelection: false,
                    parseOptions: {
                        preserveWhitespace: 'full',
                    },
                });
              },
              mouseout(view, event) {
                event.preventDefault();
                if (
                  (event.target as HTMLElement).className.includes(
                    'ProseMirror'
                  )
                )
                  return;
                const { from, to } = getPos(view, event);
                const node = view.state.doc.nodeAt(from);
                const main_node = node.child(0);
                // console.log(main_node);

                if (node.type.name == 'draggableItem') {
                  const tr = (view.state.tr as any).replaceWith(from, to, main_node);
                  const newState = view.state.apply(tr);
                  view.updateState(newState);
                }
              },
            },
          },
        }),
      ];
    },
  });
};

export default DraggableItemExtension;
