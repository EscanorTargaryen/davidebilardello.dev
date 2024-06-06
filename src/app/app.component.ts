import {afterNextRender, Component, NgZone} from '@angular/core';
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

  constructor(private canva: CanvaService, private ngZone: NgZone) {

    afterNextRender(() => {
      this.ngZone.runOutsideAngular(() => {
        import("./class/Scenes").then(({Scenes}) => {
          this.canva.canva = new Scenes();

          gsap.registerPlugin(ScrollTrigger);

          gsap.timeline({

            scrollTrigger: {
              onEnter: () => {
                this.canva.setColor(CanvaService.secondColor)
                this.canva.setSpeed(0.01)
                this.canva.setDensity(6)
              },
              onLeaveBack: () => {
                this.canva.setColor(CanvaService.defaultColor)
                this.canva.setSpeed(0.1)
                this.canva.setDensity(2)
              },
              trigger: ".title",
              scrub: true,
              end: "+=600"
            }
          }).to(this.canva.canva.scene.position, {
            x: -1.5
          })

          setTimeout(() => { // DOM is not ready yet

            gsap.timeline({

              scrollTrigger: {
                refreshPriority: 10,

                onEnter: () => {
                  this.canva.setColor(CanvaService.thirdColor)
                  this.canva.setSpeed(0.01)
                  this.canva.setDensity(3.5)
                },

                onLeaveBack: () => {
                  this.canva.setColor(CanvaService.secondColor)
                  this.canva.setSpeed(0.01)
                  this.canva.setDensity(6)
                },
                trigger: ".aboutme",
                scrub: true,
                end: "+=600"
              }
            }).to(this.canva.canva.scene.position, {
              x: 1.5
            })

          }, 1000)

          let rot = gsap.timeline().to(this.canva.canva.scene.rotation, {
            y: 2,

            scrollTrigger: {
              start: "top top",
              end: "bottom bottom",
              scrub: true
            }
          })

        })

      });
    })

  }

}
