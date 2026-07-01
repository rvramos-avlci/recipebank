<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Mark overdue invoices daily at midnight
Schedule::call(function () {
    app(\App\Services\InvoiceService::class)->checkOverdue();
})->dailyAt('00:05')->name('mark-overdue-invoices');
