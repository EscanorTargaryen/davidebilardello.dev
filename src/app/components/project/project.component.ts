import {Component, Input} from '@angular/core';
import {TextFont, TextType} from "../typography/TypographyEnums";
import {NgOptimizedImage} from "@angular/common";
import {TypographyComponent} from "../typography/typography.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TypographyComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  @Input()
  title: string = "";

  @Input()
  description: string = "";

  @Input()
  tags = [""];

  @Input()
  website = "";

  @Input()
  github = "";

  @Input()
  document = "";

  @Input()
  img = "";

  @Input()
  imgW = 0;

  @Input()
  imgH = 0;

  protected readonly TextFont = TextFont;
  protected readonly TextType = TextType;
}
