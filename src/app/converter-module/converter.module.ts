import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { CurrencyConverterRoutingModule } from "./converter-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { CurrencyConverterComponent } from "./currency-converter/currency-converter.component";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SharedModule } from "../shared/shared.module";
import { HistoryComponent } from "./history/history.component";
import { UnitConverterComponent } from "./unit-converter/unit-converter.component";

@NgModule({
  declarations: [
    CurrencyConverterComponent,
    HistoryComponent,
    UnitConverterComponent,
  ],
  imports: [
    CommonModule,
    CurrencyConverterRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTableModule,
    SharedModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
})
export class CurrencyConverterModule {}
