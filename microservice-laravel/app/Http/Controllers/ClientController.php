<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    // Register a new client
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|string|unique:clients',
            'names' => 'required|string',
            'email' => 'required|email|unique:clients',
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $client = Client::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Client registered successfully in Laravel',
            'data' => $client
        ], 201);
    }

    // Get client by document
    public function show($document)
    {
        $client = Client::where('document', $document)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $client
        ]);
    }

    // Send Token (Simulation)
    public function sendToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string'
        ]);

        // In a real app, send actual email here.
        // Mail::to($request->email)->send(new TokenMail($request->token));
        
        // Log for simulation
        \Log::info("Sending Token {$request->token} to {$request->email}");

        return response()->json([
            'success' => true,
            'message' => 'Token sent successfully'
        ]);
    }
}
