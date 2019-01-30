import { Component, Input, ViewChild } from "@angular/core";
import { AbstractValueAccessor, MakeProvider } from "../abstractValueAccessor";
import { Platform, Scroll } from "ionic-angular";

@Component({
  selector : 'select-slider',
  templateUrl: 'select-slider.html',
  providers: [MakeProvider(SelectSlider)]
})
export class SelectSlider extends AbstractValueAccessor {
  @Input('options') options: Array<any> = [];
  @Input('elements') elements: Array<ChoiceElement>;

  @ViewChild('scrollElement') scrollElement: Scroll;

  idx: number;
  oldIdx: number;

  leftArrow: boolean = false;
  rightArrow: boolean = false;

  platformClass: string;

  constructor(private platform: Platform) {
    super();
    this.platformClass = platform.is('ios') ? 'ios' : 'md';
  }

  private updateArrows(element: any) {
    const x = element.scrollLeft;
    const width = element.scrollWidth;
    const cWidth = element.offsetWidth + 5;

    this.leftArrow = (x > 5);
    this.rightArrow = !!( width > cWidth && (x < width - cWidth - 5) );
  }

  private scrollTo(left: number) {
    if (this.platform.is('core')) {
      this.scrollElement._scrollContent.nativeElement.scrollLeft = left;
    }
    else {
      this.scrollElement._scrollContent.nativeElement.scrollTo({ left: left, behavior: 'smooth' });
    }
  }

  ngAfterContentInit() {
    this.scrollElement.addScrollEventListener((event: any) => {
      this.onScroll(event);
    });
  }

  ngAfterContentChecked() {
    this.idx = this.options.indexOf(this.value);
    if (this.oldIdx !== this.idx) {
      this.oldIdx = this.idx;
      if(this.idx == this.elements.length - 1) {
        const width = this.scrollElement._scrollContent.nativeElement.scrollWidth;
        this.scrollTo(width);
      };
    }
    this.updateArrows(this.scrollElement._scrollContent.nativeElement);
  }

  select(i: number) {
    this.idx = i;
    this.writeValue(this.options[i]);
  }

  onScroll(event: any) {
    this.updateArrows(event.target);
  }

  scrollLeft() {
    const left = this.scrollElement._scrollContent.nativeElement.scrollLeft;
    this.scrollTo(left - 100);
  }

  scrollRight() {
    const left = this.scrollElement._scrollContent.nativeElement.scrollLeft;
    this.scrollTo(left + 100);
  }

}

export interface ChoiceElement {
  caption: string,
  color?: string
  disabled?: boolean
}
