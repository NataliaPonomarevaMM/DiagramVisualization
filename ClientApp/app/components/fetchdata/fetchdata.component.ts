import { Component, Inject } from "@angular/core";
import { Http } from "@angular/http";
import * as d3 from "d3";
import { range } from "d3";
import { IHierarchy, IIris } from "../iris";

@Component({
    selector: "fetchdata",
    templateUrl: "./fetchdata.component.html",
})
export class FetchDataComponent {
    public irises: IIris[] = [];
    public hierarchy: IHierarchy;

    constructor(http: Http, @Inject("BASE_URL") baseUrl: string) {
        http.get(baseUrl + "api/KData/Irises").subscribe((result) => {
            this.irises = result.json() as IIris[];
        }, (error) => console.error(error));

        http.get(baseUrl + "api/HierarchyData/Irises").subscribe((result) => {
            this.hierarchy = result.json() as IHierarchy;
        }, (error) => console.error(error));
    }
}
