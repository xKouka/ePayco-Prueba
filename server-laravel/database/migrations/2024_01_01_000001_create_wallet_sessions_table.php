<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('wallet_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->string('token');
            $table->string('client_id');
            $table->decimal('amount', 15, 2);
            $table->string('status')->default('PENDING'); // PENDING, COMPLETED
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('wallet_sessions');
    }
};
