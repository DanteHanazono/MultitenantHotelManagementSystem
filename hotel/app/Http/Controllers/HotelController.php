<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Http\Requests\HotelRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class HotelController extends Controller
{
    public function index(): Response
    {
        $hotels = Tenant::query()
            ->latest('tenant_id')
            ->get();

        return Inertia::render('hotels', [
            'hotels' => $hotels,
        ]);
    }

    public function store(HotelRequest $request): RedirectResponse
    {
        Tenant::create($request->validated());

        return redirect()
            ->route('hotels.index')
            ->with('success', 'Hotel created successfully.');
    }

    public function update(HotelRequest $request, int $id): RedirectResponse
    {
        $hotel = Tenant::findOrFail($id);
        $hotel->update($request->validated());

        return redirect()
            ->route('hotels.index')
            ->with('success', 'Hotel updated successfully.');
    }
}
