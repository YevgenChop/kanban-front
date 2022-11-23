import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutofocusDirective {
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.host.nativeElement.focus();
    });
  }
}
