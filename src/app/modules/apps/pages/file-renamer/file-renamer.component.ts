import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-renamer',
  templateUrl: './file-renamer.component.html',
  styleUrls: ['./file-renamer.component.scss'],
  standalone: true,
  imports:[FormsModule,CommonModule]
})
export class FileRenamerComponent {
  selectedFiles: File[] = [];
  prefix: string = '';

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  displayFileNames(): string[] {
    return this.selectedFiles.map(file => file.name);
  }

  renameAndDownloadFiles(): void {
    this.selectedFiles.forEach((file, index) => {
      const newFileName = `${this.prefix}${index + 1}-${file.name}`;
      this.downloadFile(file, newFileName);
    });
  }

  private downloadFile(file: File, newFileName: string): void {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
