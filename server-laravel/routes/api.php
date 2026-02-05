<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WalletController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('wallet')->group(function () {
    Route::post('/registroCliente', [WalletController::class, 'registroCliente']);
    Route::post('/recargarBilletera', [WalletController::class, 'recargarBilletera']);
    Route::post('/solicitarPago', [WalletController::class, 'solicitarPago']);
    Route::post('/confirmarPago', [WalletController::class, 'confirmarPago']);
    Route::get('/consultarSaldo', [WalletController::class, 'consultarSaldo']);
});
