import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'david-sender-control-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss'],
})
export class ControlBarComponent {
  steps = [1, 2, 3, 4]; // puedes definir cuántos pasos quieras
  currentStep = 0;

  @Output() stepChange = new EventEmitter<number>();

  goToPreviousStep() {
    if (this.currentStep > 0) {
  this.currentStep--;
  this.emitStep();
    }
  }

  goToNextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.emitStep();
    } else {
      console.log('Finalizar proceso');
    }
  }

  emitStep() {
    this.stepChange.emit(this.currentStep);
  }
}
