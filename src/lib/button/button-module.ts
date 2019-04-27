/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatCommonModule, MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';

import {MatAnchor, MatButton, MatDialButton, MatFabDialList} from './button';


@NgModule({
  imports: [CommonModule, MatRippleModule, MatCommonModule, MatIconModule],
  exports: [MatButton, MatAnchor, MatDialButton, MatCommonModule, MatFabDialList],
  declarations: [MatButton, MatAnchor, MatDialButton, MatFabDialList],
})
export class MatButtonModule {
}
