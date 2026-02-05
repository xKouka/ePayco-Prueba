<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\WalletSession;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * Formato de respuesta estandarizado
     */
    private function jsonResponse($status, $message, $data = null, $error = null)
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data,
            'error' => $error
        ], $status);
    }

    public function registroCliente(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|numeric|unique:clients,document',
            'names' => 'required|string|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/|min:3',
            'email' => 'required|email',
            'phone' => 'required|numeric|digits:10',
        ], [
            'names.regex' => 'El nombre solo puede contener letras y espacios',
            'document.unique' => 'El cliente ya está registrado',
        ]);

        if ($validator->fails()) {
            return $this->jsonResponse(400, $validator->errors()->first(), null, $validator->errors());
        }

        $client = Client::create($request->all() + ['balance' => 0]);

        return $this->jsonResponse(201, 'Cliente registrado exitosamente', $client);
    }

    public function recargarBilletera(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|numeric',
            'phone' => 'required|numeric',
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return $this->jsonResponse(400, $validator->errors()->first());
        }

        $client = Client::where('document', $request->document)
            ->where('phone', $request->phone)
            ->first();

        if (!$client) {
            return $this->jsonResponse(404, 'Cliente no encontrado o el teléfono no coincide');
        }

        $client->balance += $request->amount;
        $client->save();

        return $this->jsonResponse(200, 'Billetera recargada exitosamente', ['balance' => $client->balance]);
    }

    public function solicitarPago(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|numeric',
            'phone' => 'required|numeric',
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return $this->jsonResponse(400, $validator->errors()->first());
        }

        $client = Client::where('document', $request->document)
            ->where('phone', $request->phone)
            ->first();

        if (!$client) {
            return $this->jsonResponse(404, 'Cliente no encontrado');
        }

        if ($client->balance < $request->amount) {
            return $this->jsonResponse(400, 'Saldo insuficiente');
        }

        $token = strval(rand(100000, 900000));
        $sessionId = (string) Str::uuid();

        // Simulación de envío de token
        Log::info(" [LARAVEL SIMULACIÓN EMAIL] Enviando token $token a {$client->email}");

        WalletSession::create([
            'session_id' => $sessionId,
            'token' => $token,
            'client_id' => $client->document,
            'amount' => $request->amount,
            'status' => 'PENDING'
        ]);

        return $this->jsonResponse(200, 'Token enviado al correo electrónico (Consola Laravel)', ['sessionId' => $sessionId]);
    }

    public function confirmarPago(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sessionId' => 'required',
            'token' => 'required|numeric|digits:6',
        ]);

        if ($validator->fails()) {
            return $this->jsonResponse(400, $validator->errors()->first());
        }

        $session = WalletSession::where('session_id', $request->sessionId)
            ->where('status', 'PENDING')
            ->first();

        if (!$session) {
            return $this->jsonResponse(404, 'Sesión inválida o expirada');
        }

        if ($session->token !== $request->token) {
            return $this->jsonResponse(400, 'Token inválido');
        }

        $client = Client::where('document', $session->client_id)->first();

        if (!$client || $client->balance < $session->amount) {
            return $this->jsonResponse(400, 'Saldo insuficiente o cliente no encontrado');
        }

        $client->balance -= $session->amount;
        $client->save();

        $session->status = 'COMPLETED';
        $session->save();

        return $this->jsonResponse(200, 'Pago confirmado exitosamente', ['newBalance' => $client->balance]);
    }

    public function consultarSaldo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|numeric',
            'phone' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return $this->jsonResponse(400, $validator->errors()->first());
        }

        $client = Client::where('document', $request->document)
            ->where('phone', $request->phone)
            ->first();

        if (!$client) {
            return $this->jsonResponse(404, 'Cliente no encontrado');
        }

        return $this->jsonResponse(200, 'Saldo consultado exitosamente', ['balance' => $client->balance]);
    }
}
