import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontakAndSupportComponent } from './kontak-and-support.component';

describe('KontakAndSupportComponent', () => {
  let component: KontakAndSupportComponent;
  let fixture: ComponentFixture<KontakAndSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontakAndSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontakAndSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
