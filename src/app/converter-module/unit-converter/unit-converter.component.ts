import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatTableDataSource } from "@angular/material/table";

import { Statistics } from "../../shared/interface/exchange-rates.model";

import { StorageService } from "../../shared/service/storage.service";

import {
  FormNames,
  LocalStorageItems,
  TableColumnNames,
  TimeIntervalTypes,
} from "../../shared/interface/enums.model";
import { CurrencyExchangeService, PeriodicHistoryElement } from "src/app/shared/service/currency-exchange.service";
import { unitArrayValues, UnitInterface } from "./unitValues";

@Component({
  selector: "app-unit-converter",
  templateUrl: "./unit-converter.component.html",
  styleUrls: ["./unit-converter.component.scss"],
})
export class UnitConverterComponent implements OnInit {
  displayedHistoricalColumns: string[] = [
    TableColumnNames.Date,
    TableColumnNames.ExchangeRate,
  ];

  statisticalData: Statistics[] = [];

  statisticalDataSource = new MatTableDataSource(this.statisticalData);
  displayedStatisticalColumns: string[] = [
    TableColumnNames.Name,
    TableColumnNames.Summary,
  ];

  selectedDuration =
    StorageService.getItem(LocalStorageItems.SelectedTimeInterval) ||
    TimeIntervalTypes.AllTime;

  converterForm: FormGroup;
  unitValues: UnitInterface[];

  id: number = new Date().getTime();
  amount: number;
  fromRate: number;
  fromUnit: string;
  toRate: number;
  toUnit: string;
  result: number;
  loading = false;

  private readonly FIRST_ITEM = 0;

  constructor(public currencyExchangeService: CurrencyExchangeService) {}

  ngOnInit() {
    this.converterForm = this.currencyExchangeService.converterUnitForm;
    this.unitValues = unitArrayValues;
  }

  convert = (): void => {
    this.loading = true;
    this.result = this.currencyExchangeService.convertUnits(
      this.converterForm.controls[FormNames.AmountControl].value,
      this.converterForm.controls[FormNames.FromControl].value,
      this.converterForm.controls[FormNames.ToControl].value
    );
    this.amount = Math.floor(
      this.converterForm.get(FormNames.AmountControl).value
    );
    this.fromUnit = this.converterForm.controls[FormNames.FromControl].value;
    this.toUnit = this.converterForm.controls[FormNames.ToControl].value;
    this.incrementNumberForID();
    this.currencyExchangeService.periodicHistoryExchangeRates.unshift(
      this.setPeriodicHistoryElement()
    );
    this.setExchangeRates();
    this.loading = false;
  };

  selectUnitByEnter(event: MatOptionSelectionChange, inputName: string): void {
    if (event.isUserInput) {
      inputName = event.source.value;
    }
  }

  selectUnitByClick(selectedOption: string, formControlName: string) {
    this.converterForm.controls[formControlName].setValue(selectedOption);
    this.setFormValidity();
  }

  setFormValidity() {
    const amountControlValue =
      this.converterForm.controls[FormNames.AmountControl].value;
    const fromControlValue =
      this.converterForm.controls[FormNames.FromControl].value;
    const toControlValue =
      this.converterForm.controls[FormNames.ToControl].value;

    const isAmount = !!amountControlValue;
    const isTo = !!fromControlValue;
    const isFrom = !!toControlValue;

    this.currencyExchangeService.isUnitValid = isAmount && isTo && isFrom;
  }

  selectWrittenUnit(event: any, inputName: string): void {
    const writtenUnit = event.target.value.toUpperCase();

    const matchedUnit =
      this.unitValues.filter((currency) => currency.name.includes(writtenUnit))[
        this.FIRST_ITEM
      ] || "".toString();

    if (writtenUnit.length === 3 && !!matchedUnit) {
      this.converterForm.controls[inputName].setValue(matchedUnit);
    }

    this.setFormValidity();
  }

  changeExchangeInputValues(): void {
    this.converterForm = new FormGroup({
      amountControl: new FormControl(
        this.converterForm.get(FormNames.AmountControl).value,
        [Validators.required]
      ),
      fromControl: new FormControl(
        this.converterForm.get(FormNames.ToControl).value,
        [Validators.required, Validators.minLength(2)]
      ),
      toControl: new FormControl(
        this.converterForm.get(FormNames.FromControl).value,
        [Validators.required, Validators.minLength(2)]
      ),
    });
    this.convert();
  }

  incrementNumberForID(): number {
    return (this.id += 1);
  }

  setPeriodicHistoryElement(): PeriodicHistoryElement {
    return {
      id: this.id,
      date: `${this.currencyExchangeService.getCurrentDate("/")}
\n@${this.currencyExchangeService.getCurrentTime(":")}`,
      fromCurrency: this.fromUnit,
      toCurrency: this.toUnit,
      amount: this.amount,
      result: this.result,
    };
  }

  setExchangeRates(): void {
    return StorageService.setObject(LocalStorageItems.SavedValues, [
      ...this.currencyExchangeService.periodicHistoryExchangeRates,
    ]);
  }
}
