import { CommonModule, CurrencyPipe, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../models/card';

@Component({
  selector: '[single-card]',
  templateUrl: './single-card.component.html',
  standalone: true,
  imports: [NgStyle, CurrencyPipe,CommonModule],
})
export class SingleCardComponent implements OnInit {
  @Input() card: Card = <Card>{};

  constructor() {}

  ngOnInit(): void {}
}
