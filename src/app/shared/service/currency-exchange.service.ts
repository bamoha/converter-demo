import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ExchangeRatesResponse } from "../interface/exchange-rates.model";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "./storage.service";
import { LocalStorageItems } from "../interface/enums.model";
import converter from "convert-units";

export interface PeriodicHistoryElement {
  id: number;
  date: string;
  fromCurrency?: string;
  toCurrency?: string;
  amount?: number;
  result?: number;
}

@Injectable({
  providedIn: "root",
})
export class CurrencyExchangeService {
  constructor(public http: HttpClient) {}

  converterForm: FormGroup = new FormGroup({
    amountControl: new FormControl("", [Validators.required]),
    fromControl: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    toControl: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  converterUnitForm: FormGroup = new FormGroup({
    amountControl: new FormControl("", [Validators.required]),
    fromControl: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
    toControl: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  periodicHistoryExchangeRates: PeriodicHistoryElement[] =
    <PeriodicHistoryElement[]>(
      StorageService.getObject(LocalStorageItems.SavedValues)
    ) || [];

  fromCurrencies: string[] = [];
  toCurrencies: string[] = [];

  currentDate: string;
  currentTime: string;
  isValid = false;
  isUnitValid = false;
  isServiceReferral = false;

  static toTwoDigits(givenNumber: number) {
    return givenNumber > 9 ? `${givenNumber}` : `0${givenNumber}`;
  }

  getCurrentDate(separator: string): string {
    const now = new Date();

    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    this.currentDate = [currentDay, currentMonth, currentYear]
      .map(CurrencyExchangeService.toTwoDigits)
      .join(separator);

    return this.currentDate;
  }

  getCurrentTime(separator: string): string {
    const now = new Date();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    this.currentTime = [currentHour, currentMinute, currentSecond]
      .map(CurrencyExchangeService.toTwoDigits)
      .join(separator);

    return this.currentTime;
  }

  toggleServiceReferral() {
    return (this.isServiceReferral = !this.isServiceReferral);
  }

  convertUnits(amount, from, to) {
    return converter(amount).from(from).to(to);
  }

  public getExchangeRates(
    baseCurrency: string,
    toCurrency: string,
    amount: string
  ): Observable<ExchangeRatesResponse> {
    return this.http.get<ExchangeRatesResponse>(
      `${environment.exchangeRatesAPIUrl}/convert?api_key=${environment.apiKey}&base=${baseCurrency}&target=${toCurrency}&base_amount=${amount}`
    );
  }
}
