import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './service/storage.service';
import { CurrencyExchangeService } from './service/currency-exchange.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [StorageService, CurrencyExchangeService],
})
export class SharedModule {}
