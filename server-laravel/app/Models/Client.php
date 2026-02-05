<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'document',
        'names',
        'email',
        'phone',
        'balance',
    ];

    protected $casts = [
        'balance' => 'float',
    ];
}
