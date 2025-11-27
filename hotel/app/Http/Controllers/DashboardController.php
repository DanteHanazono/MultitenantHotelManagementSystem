<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return match (true) {
            $user->role === 'admin' => $this->renderAdminDashboard(),
            $user->tenant_id === null => $this->renderUnassignedUserDashboard(),
            default => $this->renderTenantDashboard($user->tenant_id)
        };
    }

    private function renderAdminDashboard(): Response
    {
        $hotels = Tenant::withCount(['rooms', 'guests', 'bookings'])->get();

        $statistics = [
            'totalHotels' => $hotels->count(),
            'totalRooms' => $hotels->sum('rooms_count'),
            'totalGuests' => $hotels->sum('guests_count'),
            'totalBookings' => $hotels->sum('bookings_count'),
            'totalManagers' => User::whereRole('manager')->count(),
        ];

        return Inertia::render('dashboard', [
            'isAdmin' => true,
            'hotels' => $hotels,
            ...$statistics,
        ]);
    }

    private function renderTenantDashboard(int $tenantId): Response
    {
        $hotel = Tenant::where('tenant_id', $tenantId)
            ->withCount(['guests', 'rooms', 'bookings'])
            ->firstOrFail();

        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'hotel' => $hotel,
            'guestCount' => $hotel->guests_count,
            'roomsCount' => $hotel->rooms_count,
            'bookingsCount' => $hotel->bookings_count,
        ]);
    }

    private function renderUnassignedUserDashboard(): Response
    {
        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'isUnassigned' => true,
            'hotel' => null,
            'guestCount' => 0,
            'roomsCount' => 0,
            'bookingsCount' => 0,
            'message' => 'Please contact the administrator to assign you to a hotel.',
        ]);
    }
}
