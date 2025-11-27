<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $hotelId = $this->route('hotel');

        return [
            'hotel_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tenants', 'hotel_name')
                    ->ignore($hotelId, 'tenant_id'),
            ],
            'address' => ['required', 'string', 'max:500'],
            'contact_number' => [
                'required',
                'string',
                'max:20',
                'regex:/^[0-9+\-\s()]+$/'
            ],
        ];
    }
}
