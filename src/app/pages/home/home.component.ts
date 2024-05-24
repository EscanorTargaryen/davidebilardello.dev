import {afterNextRender, Component} from '@angular/core';
import {TypographyComponent} from "../../components/typography/typography.component";
import {TextFont, TextType} from "../../components/typography/TypographyEnums";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TypographyComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  // This is a workaround to get the window object in the component, SSR gave error when trying to access window object directly
  window: any = {
    innerHeight: 0
  }

  constructor() {

    afterNextRender(() => {
      this.window = window
    })
  }

  protected readonly TextFont = TextFont;
  protected readonly TextType = TextType;
}
