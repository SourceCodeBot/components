/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';
import {ThemePalette} from '@angular/material';


@Component({
  moduleId: module.id,
  selector: 'button-demo',
  templateUrl: 'button-demo.html',
  styleUrls: ['button-demo.css'],
})
export class ButtonDemo {
  isDisabled: boolean = false;
  clickCounter: number = 0;
  toggleDisable: boolean = false;

  _colorFab: ThemePalette = 'primary';
  get colorFab(): ThemePalette {
    return this._colorFab;
  }
  set colorFab(value: ThemePalette) {
    this._colorFab = value;
  }
  disableFab: boolean = false;
  directionFab: 'horizontal'|'vertical' = 'vertical';
  placementFab: 'top'|'bottom' = 'bottom';
}
