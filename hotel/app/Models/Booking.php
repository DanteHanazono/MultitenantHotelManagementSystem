<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $primaryKey = 'booking_id';

    protected $fillable = [
        'tenant_id',
        'guest_id',
        'room_id',
        'check_in_date',
        'check_out_date',
    ];

    public $timestamps = false;
}
