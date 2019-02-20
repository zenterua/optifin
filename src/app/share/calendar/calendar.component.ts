import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Host,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {MatCalendar} from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ShareService} from '../share.service';

/** @title Datepicker with custom calendar header */
@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  exampleHeader = ExampleHeaderComponent;
  dateFilterFrom: number = 0;
  dateFilterTo: number = 0;

  constructor(private shareService: ShareService) {
  }

  ngOnInit() {
    this.shareService.getSubjectValue().subscribe(data => {
      console.log(data);
    });
  }
  changeDate(event) {

    console.log(event);
    if ( event.targetElement.id === 'mat-input-0' ) {
      console.log(0);
      this.dateFilterFrom = new Date(event.value).getTime();
    } else {
      console.log(1);
      this.dateFilterTo = new Date(event.value).getTime();
    }

    console.log(this.dateFilterFrom, this.dateFilterTo);
    if ( this.dateFilterFrom !== 0 && this.dateFilterTo !== 0 ) {
      console.log('start filter');
    }
  }
}

/** Custom header component for datepicker. */
@Component({
  selector: 'app-example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }
    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }
    .example-double-arrow .mat-icon {
      margin: -22%;
    }
    .calendarNextBtn:after,
    .calendarPrevBtn:after{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18px;
      height: 18px;
      transform: translate(-50%, -50%);
      background-image: url('../../../assets/img/calendar-arrow-right.png');
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      content: '';
    }
    .calendarPrevBtn:after {
      background-image: url('../../../assets/img/calendar-arrow-left.png');
    }
    .mat-calendar-table th {
      color: #333;
    }
  `],
  template: `
    <div class="example-header">
      <button mat-icon-button class="calendarPrevBtn" (click)="previousClicked('month')"></button>
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button class="calendarNextBtn" (click)="nextClicked('month')"></button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleHeaderComponent<D> implements OnDestroy {
  private destroyed = new Subject<void>();

  constructor(@Host() private calendar: MatCalendar<D>,
              private dateAdapter: DateAdapter<D>,
              @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
              cdr: ChangeDetectorRef) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  get periodLabel() {
    console.log(this.dateFormats);
    return this.dateAdapter
      .format(this.calendar.activeDate, this.dateFormats.display.monthYearA11yLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this.calendar.activeDate = mode === 'month' ?
      this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
      this.dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this.calendar.activeDate = mode === 'month' ?
      this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
      this.dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
