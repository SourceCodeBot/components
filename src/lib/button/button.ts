/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {FocusMonitor} from '@angular/cdk/a11y';
import {Platform} from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  CanColor,
  CanColorCtor,
  CanDisable,
  CanDisableCtor,
  CanDisableRipple,
  CanDisableRippleCtor,
  MatRipple,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
} from '@angular/material/core';
import {ANIMATION_MODULE_TYPE} from '@angular/platform-browser/animations';

/** Default color palette for round buttons (mat-fab and mat-mini-fab) */
const DEFAULT_ROUND_BUTTON_COLOR = 'accent';

/**
 * List of classes to add to MatButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'mat-button', 'mat-flat-button', 'mat-icon-button', 'mat-raised-button', 'mat-stroked-button',
  'mat-mini-fab', 'mat-fab', 'mat-fab-dial', 'mat-mini-fab-dial'
];

// Boilerplate for applying mixins to MatButton.
/** @docs-private */
export class MatButtonBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _MatButtonMixinBase: CanDisableRippleCtor&CanDisableCtor&CanColorCtor&
    typeof MatButtonBase = mixinColor(mixinDisabled(mixinDisableRipple(MatButtonBase)));

/**
 * Material design button.
 */
@Component({
  moduleId: module.id,
  selector: `button[mat-button], button[mat-raised-button], button[mat-icon-button],
             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],
             button[mat-flat-button]`,
  exportAs: 'matButton',
  host: {
    '[disabled]': 'disabled || null',
    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.css'],
  inputs: ['disabled', 'disableRipple', 'color'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatButton extends _MatButtonMixinBase implements OnDestroy, CanDisable, CanColor,
                                                              CanDisableRipple {
  /** Whether the button is round. */
  readonly isRoundButton: boolean = this._hasHostAttributes('mat-fab', 'mat-mini-fab');

  /** Whether the button is icon button. */
  readonly isIconButton: boolean = this._hasHostAttributes('mat-icon-button');

  /** Reference to the MatRipple instance of the button. */
  @ViewChild(MatRipple) ripple: MatRipple;

  constructor(
      elementRef: ElementRef,
      /**
       * @deprecated Platform checks for SSR are no longer needed
       * @breaking-change 8.0.0
       */
      _platform: Platform, private _focusMonitor: FocusMonitor,
      // @breaking-change 8.0.0 `_animationMode` parameter to be made required.
      @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string) {
    super(elementRef);

    // For each of the variant selectors that is prevent in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }

    this._focusMonitor.monitor(this._elementRef, true);

    if (this.isRoundButton) {
      this.color = DEFAULT_ROUND_BUTTON_COLOR;
    }
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  _getHostElement() {
    return this._elementRef.nativeElement;
  }

  _isRippleDisabled() {
    return this.disableRipple || this.disabled;
  }

  /** Gets whether the button has one of the given attributes. */
  _hasHostAttributes(...attributes: string[]) {
    return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
  }
}

/**
 * Raised Material design button.
 */
@Component({
  moduleId: module.id,
  selector: `a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab],
             a[mat-mini-fab], a[mat-stroked-button], a[mat-flat-button]`,
  exportAs: 'matButton, matAnchor',
  host: {
    // Note that we ignore the user-specified tabindex when it's disabled for
    // consistency with the `mat-button` applied on native buttons where even
    // though they have an index, they're not tabbable.
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex || 0)',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
  },
  inputs: ['disabled', 'disableRipple', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatAnchor extends MatButton {
  /** Tabindex of the button. */
  @Input() tabIndex: number;

  constructor(
      platform: Platform, focusMonitor: FocusMonitor, elementRef: ElementRef,
      // @breaking-change 8.0.0 `animationMode` parameter to be made required.
      @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string) {
    super(elementRef, platform, focusMonitor, animationMode);
  }

  _haltDisabledEvents(event: Event) {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}


// Boilerplate for applying mixins to MatButton.
/** @docs-private */
export class MatDialBase {
  constructor(public _elementRef: ElementRef, protected _changeDetectorRef: ChangeDetectorRef) {}
}

export const _MatDialMixinBase: CanDisableRippleCtor&CanDisableCtor&CanColorCtor&
    typeof MatDialBase = mixinColor(mixinDisabled(mixinDisableRipple(MatDialBase)));
/**
 * Material design dial button.
 */
@Component({
  moduleId: module.id,
  selector: `button[mat-fab-dial], button[mat-mini-fab-dial], mat-fab-dial, mat-mini-fab-dial`,
  exportAs: 'matDialButton',
  host: {'[attr.tabindex]': '-1', '[attr.aria-disabled]': 'disabled.toString()'},
  inputs: ['disabled', 'disableRipple', 'color', 'open', 'icon', 'direction'],
  template: `<button mat-fab
     (click)="_toggleDial()"
     [disabled]="disabled"
     [tabIndex]="tabIndex"
     [color]="color">
      <mat-icon *ngIf="!open; else ngMatDialButtonClose">{{icon}}</mat-icon>
      <ng-template #ngMatDialButtonClose>
        <mat-icon>close</mat-icon>
      </ng-template>
    </button>
    <mat-fab-dial-list *ngIf="open">
      <ng-content></ng-content>
    </mat-fab-dial-list>`,
  styleUrls: ['button.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDialButton extends _MatDialMixinBase implements CanDisable, CanColor,
                                                                CanDisableRipple {
  /** Tabindex of the button. */
  @Input() tabIndex: number;

  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    this._open = value;
  }
  _open: boolean;

  @Input()
  get icon(): string {
    return this._icon;
  }
  set icon(value: string) {
    this._icon = value || 'add';
  }
  _icon: string = 'add';

  @Input()
  get direction(): 'vertical'|'horizontal' {
    return this._direction;
  }
  set direction(value: 'vertical'|'horizontal') {
    this._direction = value || 'vertical';
  }
  _direction: 'vertical'|'horizontal';

  constructor(elementRef: ElementRef, changeDetectorRef: ChangeDetectorRef) {
    super(elementRef, changeDetectorRef);
  }

  _toggleDial(): void {
    if (this.disabled) {
      return;
    }
    this.open = !this.open;
  }
}

/**
 * Material design action button list.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-fab-dial-list',
  template: `<ng-content select="[mat-fab], [mat-mini-fab]"></ng-content>`,
  exportAs: 'matFabDialList',
  styleUrls: ['button.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatFabDialList {
}
