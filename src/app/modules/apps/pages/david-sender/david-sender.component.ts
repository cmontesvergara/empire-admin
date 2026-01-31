import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsService } from 'src/app/core/services/applications.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SessionStorageService } from 'src/app/core/services/session-storage/session-storage.service';
import { UtilService } from 'src/app/core/services/util/util.service';
import { AgentsHubComponent } from './components/agents-hub/agents-hub.component';
import { ConfirmApplicationModalComponent } from './components/confirm-application-modal/confirm-application-modal.component';
import { ContactsLoaderComponent } from './components/contacts-loader/contacts-loader.component';
import { ControlBarComponent } from './components/control-bar/control-bar.component';
import { RichTextJsonComponent } from './components/rich-text-to-json/rich-text-to-json.component';
@Component({
  selector: 'app-david-sender',
  standalone: true,
  imports: [
    CommonModule,
    RichTextJsonComponent,
    ControlBarComponent,
    ContactsLoaderComponent,
    AgentsHubComponent,
  ],
  templateUrl: './david-sender.component.html',
  styleUrl: './david-sender.component.scss',
})
export class DavidSenderComponent implements OnInit {
  private applicationId = '7767a964-d343-43ef-b1c8-e777e35d911c';
  hasVinculated = signal(false);
  currentStep = 0;

  constructor(
    private applicationsService: ApplicationsService,
    private dialog: MatDialog,
    private utilService: UtilService,
    private sessionStorageService: SessionStorageService,
    public loadingService: LoadingService,
  ) {
    this.loadingService.loading = true;
  }
  ngOnInit(): void {
    this.validateVinculation();
  }

  subscribeToApp(): void {
    if (this.sessionStorageService.getAccessToken()) {
      this.applicationsService
        .vinculateApplication('notifications')
        .subscribe(() => {
          this.hasVinculated.set(true);
        });
    } else {
      this.sessionStorageService.saveLastUrl(this.utilService.getCurrentUrl());
      this.utilService.goTo('login');
    }
  }
  validateVinculation() {
    this.applicationsService.getApplicationsVinculated().subscribe(
      (response) => {
        if (!response || !Array.isArray(response)) {
          console.error('Invalid response from server');
          return;
        }
        response.map((app: any) => {
          if (app.applicationId === this.applicationId) {
            this.hasVinculated.set(true);
          }
        });
        this.loadingService.loading = false;
      },
      (error) => {
        this.loadingService.loading = false;
        console.error('Error fetching vinculated applications:', error);
      },
    );
  }

  openConfirmDialog(appId: string): void {
    const dialogRef = this.dialog.open(ConfirmApplicationModalComponent, {
      width: '400px',
      data: { appId },
      hasBackdrop: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Registro exitoso
      } else {
        // Cancelado
      }
    });
  }

  onStepChange(newStep: number) {
    this.currentStep = newStep;
  }
}
