import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { AuthService } from '../services/auth-service';
import {ShareService} from '../share/share.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-ubersicht',
  templateUrl: './ubersicht.component.html',
  styleUrls: ['./ubersicht.component.css']
})
export class UbersichtComponent implements OnInit {
  displayedColumns: string[] = [
    'full_time',
    'users.count',
    'users.offen',
    'users.abgelehnt',
    'users.ineinreichung',
    'users.abrechnung',
  ];
  dataSource: MatTableDataSource<any>;

  usersCount: number = 0;
  usersAbgelehntLen: number = 0;
  userOffenLen: number = 0;
  userSuccessLen: number = 0;
  usersInAbrechnung: number = 0;
  usersAbgerechnetMitAffiliate: number = 0;
  usersDataArray: any = [];
  filterDateForm: FormGroup;
  filterStartDate: number = 0;
  filterEndDate: number = 0;
  showTable: boolean = false;
  showAllUserBtn: boolean = false;
  noMathError: boolean = false;
  userPartner: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('startDate') startDate: ElementRef;
  @ViewChild('endDate') endDate: ElementRef;
  @Input() startView: 'month';

  constructor( private authService: AuthService, private shareService: ShareService) {
    this.filterDateForm = new FormGroup({
      'startDate': new FormControl(null),
      'endDate': new FormControl(null)
    });
  }

  ngOnInit() {
    // Get users Info
    this.authService.getUsers().subscribe((data: any) => {
      this.userPartner = localStorage.getItem('userPartner');

      const usersArray = Object.keys(data).map( i => {
        return data[i];
      });

      if ( this.userPartner === 'admin' ) {
        this.usersDataArray = usersArray;
      } else {
        this.usersDataArray = usersArray.filter(userDate => {
          if ( userDate.users[this.userPartner] ) {
            return userDate;
          }
        });
      }


      this.setTableData(this.usersDataArray.reverse());
    });

    this.filterDateForm.controls['startDate'].valueChanges.subscribe((data: string) => {
      const year = new Date(data).getFullYear().toString();
      const month = new Date(data).getMonth();
      const firstDayOfMotn = new Date(year).setMonth(month);
      this.filterStartDate = firstDayOfMotn;
      if ( this.filterEndDate !== 0 ) {
        this.datePickerFilter();
      }
    });

    this.filterDateForm.controls['endDate'].valueChanges.subscribe((data: string) => {
      const year = new Date(data).getFullYear();
      const month = new Date(data).getMonth();
      const lastDayOfMotn = new Date(year, month + 1, 0).getTime();
      this.filterEndDate = lastDayOfMotn;
      if ( this.filterStartDate !== 0 ) {
        this.datePickerFilter();
      }
    });
  }

  datePickerFilter() {
    const datePickerUsers = this.usersDataArray.filter( (user: any) => {
      if ( (user.full_time * 1000) <= this.filterEndDate && (user.full_time * 1000 ) >= this.filterStartDate ) {
        return user;
      }
    });
    this.setTableData(datePickerUsers);
    this.showAllUserBtn = true;
    if ( datePickerUsers.length === 0 ) {
      this.noMathError = true;
    } else {
      this.noMathError = false;
    }
  }

  setTableData(tableData) {
    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if ( this.userPartner === 'admin' ) {
        switch (property) {
          case 'users.count': return item.count;
          case 'users.offen': return item.status_count.offen;
          case 'users.abgelehnt': return item.status_count.abgelehnt;
          case 'users.ineinreichung': return item.status_count.einreichung;
          case 'users.inabrechnung': return item.status_count.inabrechnung;
          case 'users.abrechnung': return item.status_count.abrechnung;
          default: return item[property];
        }
      } else {
        switch (property) {
          case 'users.count': return item.users[this.userPartner].count;
          case 'users.offen': return item.users[this.userPartner].status_count.offen;
          case 'users.abgelehnt': return item.users[this.userPartner].status_count.abgelehnt;
          case 'users.ineinreichung': return item.users[this.userPartner].status_count.einreichung;
          case 'users.inabrechnung': return item.users[this.userPartner].status_count.inabrechnung;
          case 'users.abrechnung': return item.users[this.userPartner].status_count.abrechnung;
          default: return item[property];
        }
      }

    };
    this.dataSource.sort = this.sort;
    this.showTable = true;
    this.summAllColumn(tableData);
  }

  summAllColumn(usersArray) {
    this.usersCount = 0;
    this.usersAbgelehntLen = 0;
    this.userOffenLen = 0;
    this.userSuccessLen = 0;
    this.usersInAbrechnung = 0;
    this.usersAbgerechnetMitAffiliate = 0;

    if ( this.userPartner === 'admin' ) {
      usersArray.forEach(status => {
        if ( status.count !== undefined ) { // admin
          this.usersCount += status.count;
        }
        if ( status.status_count.offen !== undefined ) { // offen users
          this.userOffenLen += status.status_count.offen;
        }
        if ( status.status_count.abgelehnt !== undefined ) { // abgelehnt users
          this.usersAbgelehntLen += status.status_count.abgelehnt;
        }
        if ( status.status_count.einreichung !== undefined ) { // einreichung users
          this.userSuccessLen += status.status_count.einreichung;
        }
        if ( status.status_count.inabrechnung !== undefined ) { // InAbrechnung users
          this.usersInAbrechnung += status.status_count.inabrechnung;
        }
        if ( status.status_count.abrechnung !== undefined ) { // abrechnung users
          this.usersAbgerechnetMitAffiliate += status.status_count.abrechnung;
        }
      });
    } else {
      usersArray.forEach(status => {
        if ( status.users[this.userPartner].count !== undefined ) { // all users
          this.usersCount += status.users[this.userPartner].count;
        }
        if ( status.users[this.userPartner].status_count.offen !== undefined ) { // offen users
          this.userOffenLen += status.users[this.userPartner].status_count.offen;
        }
        if ( status.users[this.userPartner].status_count.abgelehnt !== undefined ) { // abgelehnt users
          this.usersAbgelehntLen += status.users[this.userPartner].status_count.abgelehnt;
        }
        if ( status.users[this.userPartner].status_count.einreichung !== undefined ) { // einreichung users
           this.userSuccessLen += status.users[this.userPartner].status_count.einreichung;
        }
        if ( status.users[this.userPartner].status_count.inabrechnung !== undefined ) { // InAbrechnung users
          this.usersInAbrechnung += status.users[this.userPartner].status_count.inabrechnung;
        }
        if ( status.users[this.userPartner].status_count.abrechnung !== undefined ) { // abrechnung users
          this.usersAbgerechnetMitAffiliate += status.users[this.userPartner].status_count.abrechnung;
        }
      });
    }
  }

  showAllUsers() {
    this.setTableData(this.usersDataArray);
    this.showAllUserBtn = false;
    this.noMathError = false;
    this.filterStartDate = 0;
    this.filterEndDate = 0;
    this.startDate.nativeElement.value = '';
    this.endDate.nativeElement.value = '';
  }
}
