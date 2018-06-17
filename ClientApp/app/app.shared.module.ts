import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";

import { DataService } from "./components/data.service";

import { AppComponent } from "./components/app/app.component";
import { DrawPlotComponent } from "./components/draw-plot/plot.component";
import { FetchDataComponent } from "./components/fetchdata/fetchdata.component";
import { RadialComponent } from "./components/radial/radial.component";

@NgModule({
    declarations: [
        AppComponent,
        FetchDataComponent,
        RadialComponent,
        DrawPlotComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: "home", component: FetchDataComponent },
            { path: "**", redirectTo: "home" },
        ],
    ),
    ],
    providers: [DataService],
})
export class AppModuleShared {
}
