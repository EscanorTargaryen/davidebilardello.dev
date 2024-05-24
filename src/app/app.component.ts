import {afterNextRender, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TypographyComponent} from "./components/typography/typography.component";
import {CanvaService} from "./service/canva.service";
import {gsap} from "gsap";

import {ScrollTrigger} from "gsap/ScrollTrigger";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TypographyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private canva: CanvaService) {

    afterNextRender(() => {
      import("./class/Scenes").then(({Scenes}) => {
        canva.canva = new Scenes();

        gsap.registerPlugin(ScrollTrigger);

        let ball = gsap.timeline()

        //rotate ball during scroll
        ball.to(canva.canva.scene.rotation, {
          y: 2,
          scrollTrigger: {
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2
          }
        })

        //move to the left during when the projects title is in view
        ball.to(canva.canva.scene.position, {
          x: -1,
          scrollTrigger: {
            trigger: ".projects-title",
            scrub: 0.5,
            end: "+=200"
          }
        })

      })
    });
  }

}
