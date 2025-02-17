import { CurrencyPipe, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Nft } from '../../../models/user-basic-information';

@Component({
    selector: '[nft-dual-card]',
    templateUrl: './nft-dual-card.component.html',
    standalone: true,
    imports: [NgStyle, CurrencyPipe],
})
export class NftDualCardComponent implements OnInit {
  @Input() nft: Nft = <Nft>{};

  constructor() {}

  ngOnInit(): void {}
}
