import { Component, Inject } from "@angular/core";
import { Http } from "@angular/http";
import { DataService, Event, IMessage } from "../data.service";
import { IHierarchy, IIris } from "../iris";

@Component({
    selector: "fetchdata",
    templateUrl: "./fetchdata.component.html",
})
export class FetchDataComponent {
    public hierarchy: IHierarchy | null = null;
    public elementNames = ["sepalLength", "sepalWidth", "petalLength", "petalWidth"];

    constructor(http: Http, @Inject("BASE_URL") baseUrl: string, private data: DataService) {
        http.get(baseUrl + "api/HierarchyData/Irises").subscribe((result) => {
            this.hierarchy = result.json() as IHierarchy;
        }, (error) => console.error(error));
    }

    public onClick() {
        this.data.sendPlot({event: Event.Stop, id: ""});
        this.data.sendBrush({event: Event.Stop, id: ""});
    }
}
