import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPersonasComponent } from './lista-personas.component';

describe('ListaPersonasComponent', () => {
  let component: ListaPersonasComponent;
  let fixture: ComponentFixture<ListaPersonasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaPersonasComponent]
    });
    fixture = TestBed.createComponent(ListaPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
