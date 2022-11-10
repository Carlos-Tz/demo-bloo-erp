import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ngInit]'
})
export class NgInitDirective {

  @Input() isLast: boolean;
  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(){
    if (this.isLast) {
      setTimeout(() => this.initEvent.emit(), 10);
    }
  }

}
