import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOptionSelectionChange } from "@angular/material/core";
import { MatTableDataSource } from "@angular/material/table";

import { distinctUntilChanged } from "rxjs/operators";
import {
  CurrencyExchangeService,
  PeriodicHistoryElement,
} from "../../shared/service/currency-exchange.service";
import { Statistics } from "../../shared/interface/exchange-rates.model";

import { StorageService } from "../../shared/service/storage.service";

import {
  FormNames,
  LocalStorageItems,
  TableColumnNames,
  TimeIntervalTypes,
} from "../../shared/interface/enums.model";
import getSymbolFromCurrency from "currency-symbol-map";
import { AlertService } from "src/app/core/alert/alert.service";
import { currencyArrayValues } from "./currencyValues";

@Component({
  selector: "app-currency-converter",
  templateUrl: "./currency-converter.component.html",
  styleUrls: ["./currency-converter.component.scss"],
})
export class CurrencyConverterComponent implements OnInit {
  periodicHistoryData: PeriodicHistoryElement[] =
    this.currencyExchangeService.periodicHistoryExchangeRates;

  dataSource = new MatTableDataSource(this.periodicHistoryData);
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
  currencyValues: string[];

  id: number = new Date().getTime();
  amount: number;
  fromRate: number;
  fromCurrency: string;
  toRate: number;
  toCurrency: string;
  result: number;
  mappedCurrencies: string[] = [];
  loading = false;

  private readonly FIRST_ITEM = 0;

  constructor(
    public currencyExchangeService: CurrencyExchangeService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.converterForm = this.currencyExchangeService.converterForm;

    this.currencyValues = currencyArrayValues;

    this.setFormValidity();
  }

  selectCurrencyByEnter(
    event: MatOptionSelectionChange,
    inputName: string
  ): void {
    if (event.isUserInput) {
      inputName = event.source.value;
    }
  }

  selectCurrencyByClick(selectedOption: string, formControlName: string) {
    this.converterForm.controls[formControlName].setValue(selectedOption);
    this.setFormValidity();
  }

  selectWrittenCurrency(event: any, inputName: string): void {
    const writtenCurrency = event.target.value.toUpperCase();

    const matchedCurrency =
      this.mappedCurrencies.filter((currency) =>
        currency.includes(writtenCurrency)
      )[this.FIRST_ITEM] || "".toString();

    if (writtenCurrency.length === 3 && !!matchedCurrency) {
      this.converterForm.controls[inputName].setValue(matchedCurrency);
    }

    this.setFormValidity();
  }

  setFormValidity() {
    const amountControlValue =
      this.converterForm.controls["amountControl"].value;
    const fromControlValue = this.converterForm.controls["fromControl"].value;
    const toControlValue = this.converterForm.controls["toControl"].value;

    const isAmount = !!amountControlValue;
    const isTo = !!fromControlValue;
    const isFrom = !!toControlValue;

    this.currencyExchangeService.isValid = isAmount && isTo && isFrom;
  }

  exchangeRates(): void {
    this.loading = true;
    this.result = undefined;
    this.currencyExchangeService
      .getExchangeRates(
        this.converterForm.get(FormNames.FromControl).value,
        this.converterForm.get(FormNames.ToControl).value,
        this.converterForm.get(FormNames.AmountControl).value
      )
      .subscribe(
        (val): void => {
          this.loading = false;
          this.result = val.converted_amount;
          this.amount = Math.floor(
            this.converterForm.get(FormNames.AmountControl).value
          );
          this.fromRate = 1;
          this.toRate = val.exchange_rate;
          this.fromCurrency = val.base;
          this.toCurrency = val.target;
          this.incrementNumberForID();
          this.currencyExchangeService.periodicHistoryExchangeRates.unshift(
            this.setPeriodicHistoryElement()
          );
          this.setExchangeRates();
        },
        (error): void => {
          this.loading = false;
          this.alertService.error(`Error: ${error.error.error.message}`);
        }
      );
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
    this.exchangeRates();
  }

  incrementNumberForID(): number {
    return (this.id += 1);
  }

  setPeriodicHistoryElement(): PeriodicHistoryElement {
    return {
      id: this.id,
      date: `${this.currencyExchangeService.getCurrentDate("/")}
\n@${this.currencyExchangeService.getCurrentTime(":")}`,
      fromCurrency: this.fromCurrency,
      toCurrency: this.toCurrency,
      amount: this.amount,
      result: this.result,
    };
  }

  setExchangeRates(): void {
    return StorageService.setObject(LocalStorageItems.SavedValues, [
      ...this.currencyExchangeService.periodicHistoryExchangeRates,
    ]);
  }

  getSymbol(rate: string): string {
    return getSymbolFromCurrency(rate);
  }
}
