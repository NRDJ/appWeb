import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appAgeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AgeValidatorDirective,
      multi: true
    }
  ]
})

export class AgeValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(Date.UTC(
      new Date(value).getUTCFullYear(),
      new Date(value).getUTCMonth(),
      new Date(value).getUTCDate()
    ));
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
      age--;
    }

    return age >= 13 ? null : { underage: true };
  }
}