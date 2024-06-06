import {Component, HostListener} from '@angular/core';
import {TypographyComponent} from "../../components/typography/typography.component";
import {TextFont, TextType} from "../../components/typography/TypographyEnums";
import {NgOptimizedImage} from "@angular/common";
import {ProjectComponent} from "../../components/project/project.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TypographyComponent,
    NgOptimizedImage,
    ProjectComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  window: any

  constructor() {
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
  }

  scrollToTop(): void {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: any) {
    if (!this.window)
      this.window = window

  }

  protected readonly TextFont = TextFont;
  protected readonly TextType = TextType;
}
