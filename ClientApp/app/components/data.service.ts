import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum Event {
    Start,
    Continue,
    Stop,
}

export interface IMessage {
    event: Event;
    id: string;
}

@Injectable()
export class DataService {
    public plotMessageSource = new BehaviorSubject<IMessage>({event: Event.Stop, id: ""});
    public radialMessageSource = new BehaviorSubject<IMessage>({event: Event.Stop, id: ""});
    public brushMessageSourse = new BehaviorSubject<IMessage>({event: Event.Stop, id: ""});
    public currentPlotMessage = this.plotMessageSource.asObservable();
    public currentRadialMessage = this.radialMessageSource.asObservable();
    public currentBrushMessage = this.brushMessageSourse.asObservable();

    public sendRadial(message: IMessage) {
        this.radialMessageSource.next(message);
    }
    public sendPlot(message: IMessage) {
        if (message.event === Event.Start) {
            this.sendBrush(message);
        }
        this.plotMessageSource.next(message);
    }
    public sendBrush(message: IMessage) {
        this.brushMessageSourse.next(message);
    }
}
