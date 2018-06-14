import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
  public messageSource = new BehaviorSubject("default message");
  public currentMessage = this.messageSource.asObservable();

  public changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
