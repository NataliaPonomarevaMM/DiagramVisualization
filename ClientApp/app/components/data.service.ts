import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
    public plotMessageSource = new BehaviorSubject("");
    public radialMessageSource = new BehaviorSubject("");
    public brushMessageSourse = new BehaviorSubject("");
    public currentPlotMessage = this.plotMessageSource.asObservable();
    public currentRadialMessage = this.radialMessageSource.asObservable();
    public currentBrushMessage = this.brushMessageSourse.asObservable();

    public sendRadial(message: string) {
        this.radialMessageSource.next(message);
    }
    public sendPlot(message: string) {
        const splitted = message.split(" ");
        if (splitted[0] === "start") {
            this.startBrush(splitted[1]);
        }
        this.plotMessageSource.next(message);
    }
    public startBrush(message: string) {
        this.brushMessageSourse.next(message);
    }
}
