import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import * as d3 from 'd3';
import { range } from 'd3';
import { Iris}  from '../iris';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html'
})

export class FetchDataComponent {
    irises: Iris[] = [];
    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/SampleData/Irises').subscribe(result => {
            this.irises = result.json() as Iris[];
        }, error => console.error(error));
    }
}
