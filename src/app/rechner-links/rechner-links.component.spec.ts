import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechnerLinksComponent } from './rechner-links.component';

describe('RechnerLinksComponent', () => {
  let component: RechnerLinksComponent;
  let fixture: ComponentFixture<RechnerLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechnerLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechnerLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
