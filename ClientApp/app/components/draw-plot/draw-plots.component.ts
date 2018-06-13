import { Component, Inject, OnInit, Input, OnChanges,
        SimpleChanges } from '@angular/core';
import { Iris}  from '../iris';

@Component({
    selector: 'draw-plot',
    templateUrl: './draw-plots.component.html'
})

export class DrawPlotsComponent implements OnChanges {
    @Input() irises: Iris[] = [];
    _irises : Iris[] = [];
    elementNames = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth']; 
    
    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            let chng = changes[propName];
            switch(propName) {
                case "irises":
                    this._irises = chng.currentValue;
                    break;
            }
          }
        if (this._irises.length != 0)
        {
            console.log(this._irises);
        }
    }
}