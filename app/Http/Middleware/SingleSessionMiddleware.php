<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SingleSessionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $currentSessionId = session()->getId();
            $userId = auth()->id();

            // Удаляем все другие сессии этого пользователя
            DB::table('sessions')
                ->where('user_id', $userId)
                ->where('id', '!=', $currentSessionId)
                ->delete();
        }

        return $next($request);
    }
}
