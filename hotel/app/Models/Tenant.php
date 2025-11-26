<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Guest;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $primaryKey = 'tenant_id';

    protected $fillable = [
        'hotel_name',
        'address',
        'contact_number',
    ];

    public $timestamps = false;

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'tenant_id', 'tenant_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'tenant_id', 'tenant_id');
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class, 'tenant_id', 'tenant_id');
    }
}
