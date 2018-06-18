import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
  public plotMessageSource = new BehaviorSubject("out");
  public radialMessageSource = new BehaviorSubject("out");
  public currentPlotMessage = this.plotMessageSource.asObservable();
  public currentRadialMessage = this.radialMessageSource.asObservable();
  public Num = 0;

  public sendRadial(message: string) {
    this.radialMessageSource.next(message);
  }
  public sendPlot(message: string) {
    this.plotMessageSource.next(message);
  }

  public getNumber() {
    return this.Num++;
  }
}
