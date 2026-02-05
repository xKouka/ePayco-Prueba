<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletSession extends Model
{
    protected $fillable = [
        'session_id',
        'token',
        'client_id',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'float',
    ];
}
