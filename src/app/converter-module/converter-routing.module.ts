import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { HistoryComponent } from './history/history.component';
import { UnitConverterComponent } from './unit-converter/unit-converter.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "converter",
    pathMatch: "full",
  },
  {
    path: "converter",
    component: CurrencyConverterComponent,
  },
  { path: "history", component: HistoryComponent },
  { path: "unit", component: UnitConverterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyConverterRoutingModule { }
