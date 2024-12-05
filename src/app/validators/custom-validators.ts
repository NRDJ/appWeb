import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const valid = emailPattern.test(value);

    return valid ? null : { email: true };
  }
  
  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const validLength = value.length >= 8 && value.length <= 20;

    const errors: ValidationErrors = {};
    if (!hasNumber) {
      errors['noNumber'] = 'Password must contain at least one number.';
    }
    if (!hasUpper) {
      errors['noUpper'] = 'Password must contain at least one uppercase letter.';
    }
    if (!hasLower) {
      errors['noLower'] = 'Password must contain at least one lowercase letter.';
    }
    if (!hasSpecial) {
      errors['noSpecial'] = 'Password must contain at least one special character.';
    }
    if (!validLength) {
      errors['invalidLength'] = 'Password must be between 8 and 20 characters long.';
    }

    return Object.keys(errors).length ? errors : null;
  }
}