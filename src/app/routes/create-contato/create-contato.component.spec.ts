import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContatoComponent } from './create-contato.component';

describe('CreateContatoComponent', () => {
  let component: CreateContatoComponent;
  let fixture: ComponentFixture<CreateContatoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateContatoComponent]
    });
    fixture = TestBed.createComponent(CreateContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
