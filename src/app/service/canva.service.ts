import {Injectable} from '@angular/core';
import {Scenes} from "../class/Scenes";


@Injectable({
  providedIn: 'root'
})
export class CanvaService {

  canva!: Scenes

  static defaultColor = [0.1, 0.2, 0.3]
  static secondColor = [0.01, 0.9, 0.5]
  static thirdColor = [0.9, 0.5, 0.01]

  constructor() {
  }

  setColor(color: number[]) {

    this.canva.rgb = color
    this.canva.updateElement()

  }

  setSpeed(speed: number) {

    this.canva.settings.speed = speed
    this.canva.updateElement()

  }

  setDensity(density: number) {

    this.canva.settings.density = density
    this.canva.updateElement()

  }


  setFrequency(frequency: number) {

    this.canva.settings.frequency = frequency
    this.canva.updateElement()

  }
}
