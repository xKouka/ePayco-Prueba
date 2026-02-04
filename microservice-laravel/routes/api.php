<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

Route::post('/clients', [ClientController::class, 'register']);
Route::get('/clients/{document}', [ClientController::class, 'show']);
Route::post('/send-token', [ClientController::class, 'sendToken']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
