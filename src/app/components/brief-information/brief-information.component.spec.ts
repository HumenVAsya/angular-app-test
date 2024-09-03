import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefInformationComponent } from './brief-information.component';

describe('BriefInformationComponent', () => {
  let component: BriefInformationComponent;
  let fixture: ComponentFixture<BriefInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BriefInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BriefInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
