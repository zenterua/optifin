import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private subject = new Subject<any>();

  constructor() {}

  sendBooleanValue(value: boolean) {
    this.subject.next(value);
  }

  sendUsersData(value: any) {
    this.subject.next(value);
  }

  getSubjectValue(): Observable<boolean>  {
    return this.subject.asObservable();
  }

}
