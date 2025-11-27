import appLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { User, Bed, CalendarCheck, Building, UserCog } from "lucide-react";
import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";

interface Room {
    room_id: number;
    room_number: string;
    type: string;
    price_per_night: number;
    status: string;
}

interface Hotel {
    tenant_id: number;
    hotel_name: string;
    address: string;
    contact_number: string;
    rooms: Room[];
}

export default function Dashboard() {
    const { isAdmin, isUnassigned, hotels, hotel, guestCount, roomsCount, bookingsCount, totalHotels, totalRooms, totalManagers, totalGuests, message } = usePage().props as unknown as any;

    if (isUnassigned) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
                <Head title="Dashboard" />
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-xl font-bold text-gray-600">{message}</h1>
                </div>
            </AppLayout>
        );
    }

    const [open, setOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const handleHotelClick = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setOpen(true);
    };

    if (isAdmin) {
        const safeHotels: Hotel[] = Array.isArray(hotels) ? hotels : [];
        return (
            <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
                <Head title="Admin Dashboard" />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">All Hotels Overview</h1>{/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 text-center bg-blue-50 dark:bg-blue-950 borden-blue-200 dark:border-blue-800">
                            <Building className="mx-auto mb-2 text-blue-500" size={32} />
                            <div className="text-lg font-semibold mb-2">Total Hotels</div><div className="text-3xl font-bold">{totalHotels ?? 0}</div>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

}
