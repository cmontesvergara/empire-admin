import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rich-text-to-json',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rich-text-to-json.component.html',
  styleUrls: ['./rich-text-to-json.component.scss'],
})
export class RichTextJsonComponent {
  text: string = '';
  jsonOutput: Record<string, string> = {};
  renderedLines: string[] = [];
  expanded = false;

  format(type: 'bold' | 'italic' | 'code' | 'tach') {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.text.slice(start, end);

    // Define el wrapper según el tipo
    const wrapper =
      type === 'bold'
        ? '*'
        : type === 'italic'
        ? '_'
        : type === 'code'
        ? '`'
        : type === 'tach'
        ? '~'
        : '';

    const before = this.text.slice(0, start);
    const after = this.text.slice(end);

    // Toggle: si ya está envuelto, lo quita
    if (
      selected.startsWith(wrapper) &&
      selected.endsWith(wrapper) &&
      selected.length >= 2
    ) {
      const unwrapped = selected.slice(
        wrapper.length,
        selected.length - wrapper.length,
      );
      this.text = before + unwrapped + after;
      // reajusta selección para mantener el texto original seleccionado
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, end - 2 * wrapper.length);
      }, 0);
    } else {
      this.text = before + wrapper + selected + wrapper + after;
      // reajusta selección para abarcar el contenido dentro de los wrappers
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + wrapper.length,
          end + wrapper.length,
        );
      }, 0);
    }

    this.generateJson();
  }

  generateJson() {
    const lines = this.text.split('\n');
    this.jsonOutput = {};
    this.renderedLines = [];

    lines.forEach((line, i) => {
      const key = `empty${i + 1}`;
      this.jsonOutput[key] = line.trim() === '' ? ' ' : line;
      this.renderedLines.push(this.renderLine(line));
    });
  }

  renderLine(text: string): string {
    // Negrita: *text*
    text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    // Itálica: _text_
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    // Monoespaciado: `text`
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/~(.*?)~/g, '<del>$1</del>');
    return text || '&nbsp;';
  }
}
