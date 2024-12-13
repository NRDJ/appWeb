import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S3ManagerComponent } from './s3-manager.component';

describe('S3ManagerComponent', () => {
  let component: S3ManagerComponent;
  let fixture: ComponentFixture<S3ManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [S3ManagerComponent]
    });
    fixture = TestBed.createComponent(S3ManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
