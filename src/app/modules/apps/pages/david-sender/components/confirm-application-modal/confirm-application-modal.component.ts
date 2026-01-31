import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationsService } from 'src/app/core/services/applications.service';

@Component({
  selector: 'app-confirm-application-modal',
  templateUrl: './confirm-application-modal.component.html',
  styleUrls: ['./confirm-application-modal.component.scss'],
})
export class ConfirmApplicationModalComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ConfirmApplicationModalComponent>,
    private applicationsService: ApplicationsService,
    @Inject(MAT_DIALOG_DATA) public data: { appId: string },
  ) {}

  confirm() {
    this.loading = true;
    this.error = null;

    this.applicationsService.vinculateApplication(this.data.appId).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.error = 'Hubo un problema al registrarte. Intenta nuevamente.';
        this.loading = false;
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
