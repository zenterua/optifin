import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileinstellungenComponent } from './profileinstellungen.component';

describe('ProfileinstellungenComponent', () => {
  let component: ProfileinstellungenComponent;
  let fixture: ComponentFixture<ProfileinstellungenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileinstellungenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileinstellungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
