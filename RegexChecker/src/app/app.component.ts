import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'RegexChecker';
  formGroup!: FormGroup;
  isRegexValid: boolean = false;
  resultMessage: string = '';
  isResultValid!: boolean;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  clearField(controlName: string) {
    this.formGroup.controls[controlName].markAsPristine();
    this.formGroup.controls[controlName].setValue('');
    this.resultMessage = '';
  }

  checkString() {
    try {
      let regExp = new RegExp(this.formGroup.controls['regex'].value);
      this.isResultValid = regExp.test(this.formGroup.controls['string'].value);
      this.resultMessage = this.isResultValid
        ? 'String matches the pattern.'
        : 'String does not match the pattern.';
    } catch (e) {
      this.resultMessage = e as string;
    }
  }

  onRegexInputChange() {
    this.isRegexValid = this.isRegexPattern(
      this.formGroup.controls['regex'].value
    );
    this.resultMessage = '';
  }

  isRegexPattern(str: string): boolean {
    if (!str) {
      return false;
    }

    try {
      new RegExp(str);

      return true;
    } catch (e) {
      return false;
    }
  }
  
  private buildForm() {
    this.formGroup = this.formBuilder.group({
      regex: ['', Validators.required],
      string: ['', Validators.required],
    });
  }
}
