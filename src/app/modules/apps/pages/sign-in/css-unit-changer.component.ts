import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'esoft-css-unit-changer',
  templateUrl: './css-unit-changer.component.html',
  styleUrls: ['./css-unit-changer.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class CssUnitChangerComponent  {

  inputUnit='px'

  inputData=''
  widthReference ='1440'
  outputUnit='vw'
  outputData=''
  constructor( ) {}
  handle() {
    let dataConverted = this.convert(
      JSON.stringify(this.inputData),
      this.widthReference,
      this.inputUnit,
      this.outputUnit
    );
    this.outputData = JSON.parse(dataConverted);
  }

  convert(scssString:any, reference:any, inputUnit:any, outputUnit:any) {
    let pxRegex;

    switch (inputUnit) {
      case "px":
        pxRegex = /(\d*\.?\d+)px/g;
        break;
      case "vw":
        pxRegex = /(\d*\.?\d+)vw/g;
        break;
      case "vp":
        pxRegex = /(\d*\.?\d+)vp/g;
        break;
    }

    let resultado = scssString.replace(
      pxRegex,
      (match:any, matchedValue:any) => {
        let newValue;
        console.log(`${inputUnit}${outputUnit}`);
        switch (`${inputUnit}${outputUnit}`) {
          case "pxvw": {
            newValue = ((matchedValue * 100) / reference).toFixed(2);
            return newValue + outputUnit;
          }
          case "vwpx": {
            newValue = ((matchedValue / 100) * reference).toFixed(0);
            return newValue + outputUnit;
          }
          default:

            return 'any'
        }
      }
    );
    return resultado;
  }
  selectDefaultOutputUnit() {
    if (this.inputUnit == "px") this.outputUnit = "vw";
    if (this.inputUnit == "vw") this.outputUnit = "px";
  }


}
