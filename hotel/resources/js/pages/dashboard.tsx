import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { User, Bed, CalendarCheck, Building, UserCog } from "lucide-react";
import { useState, type FC } from "react";

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

interface DashboardProps {
    isAdmin?: boolean;
    isUnassigned?: boolean;
    hotels?: Hotel[];
    hotel?: Hotel;
    guestCount?: number;
    roomsCount?: number;
    bookingsCount?: number;
    totalHotels?: number;
    totalRooms?: number;
    totalManagers?: number;
    totalGuests?: number;
    message?: string;
}

const UnassignedUserView: FC<{ message: string }> = ({ message }) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
        <Head title="Dashboard" />
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-xl font-bold text-gray-600">{message}</h1>
        </div>
    </AppLayout>
);

const StatCard: FC<{
    icon: React.ReactNode;
    title: string;
    value: number;
    bgColor: string;
    borderColor: string;
    iconColor: string;
}> = ({ icon, title, value, bgColor, borderColor, iconColor }) => (
    <Card className={`p-6 text-center ${bgColor} ${borderColor}`}>
        <div className={`mx-auto mb-2 ${iconColor}`}>{icon}</div>
        <div className="text-lg font-semibold mb-2">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
    </Card>
);

const HotelDetailsDialog: FC<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hotel: Hotel | null;
}> = ({ open, onOpenChange, hotel }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{hotel?.hotel_name}</DialogTitle>
                <DialogDescription>
                    <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                        Address: {hotel?.address}
                    </div>
                    <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                        Contact: {hotel?.contact_number}
                    </div>
                    <div className="font-medium mb-1">Rooms:</div>
                    <ul className="ml-4 list-disc">
                        {hotel?.rooms && hotel.rooms.length > 0 ? (
                            hotel.rooms.map((room) => (
                                <li key={room.room_id} className="flex items-center text-sm mb-1">
                                    <Bed className="mr-1 text-green-500" size={16} />
                                    Room {room.room_number} - {room.type} - {room.status} - ${room.price_per_night}
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-gray-400">No rooms available.</li>
                        )}
                    </ul>
                </DialogDescription>
            </DialogHeader>
            <DialogClose />
        </DialogContent>
    </Dialog>
);

const AdminDashboardView: FC<{
    hotels: Hotel[];
    totalHotels: number;
    totalRooms: number;
    totalManagers: number;
    totalGuests: number;
}> = ({ hotels, totalHotels, totalRooms, totalManagers, totalGuests }) => {
    const [open, setOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const handleHotelClick = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setOpen(true);
    };

    const adminStats = [
        {
            icon: <Building size={32} />,
            title: 'Total Hotels',
            value: totalHotels,
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconColor: 'text-blue-500'
        },
        {
            icon: <Bed size={32} />,
            title: 'Total Rooms',
            value: totalRooms,
            bgColor: 'bg-green-50 dark:bg-green-950',
            borderColor: 'border-green-200 dark:border-green-800',
            iconColor: 'text-green-500'
        },
        {
            icon: <UserCog size={32} />,
            title: 'Total Managers',
            value: totalManagers,
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            borderColor: 'border-purple-200 dark:border-purple-800',
            iconColor: 'text-purple-500'
        },
        {
            icon: <User size={32} />,
            title: 'Total Guests',
            value: totalGuests,
            bgColor: 'bg-yellow-50 dark:bg-yellow-950',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            iconColor: 'text-yellow-500'
        }
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Admin Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">All Hotels Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {adminStats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotels.map((hotel) => (
                        <button
                            key={hotel.tenant_id}
                            type="button"
                            className="text-left w-full focus:outline-none"
                            onClick={() => handleHotelClick(hotel)}
                        >
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center mb-2">
                                    <Building className="text-blue-500 mr-2" />
                                    <span className="text-lg font-semibold">{hotel.hotel_name}</span>
                                </div>
                            </Card>
                        </button>
                    ))}
                </div>

                <HotelDetailsDialog
                    open={open}
                    onOpenChange={setOpen}
                    hotel={selectedHotel}
                />
            </div>
        </AppLayout>
    );
};

const TenantDashboardView: FC<{
    hotel: Hotel;
    guestCount: number;
    roomsCount: number;
    bookingsCount: number;
}> = ({ hotel, guestCount, roomsCount, bookingsCount }) => {
    const tenantStats = [
        {
            icon: <User size={32} />,
            title: 'Total Guests',
            value: guestCount,
            iconColor: 'text-blue-500'
        },
        {
            icon: <Bed size={32} />,
            title: 'Total Rooms',
            value: roomsCount,
            iconColor: 'text-green-500'
        },
        {
            icon: <CalendarCheck size={32} />,
            title: 'Total Bookings',
            value: bookingsCount,
            iconColor: 'text-purple-500'
        }
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    {hotel?.hotel_name || 'No Hotel Selected'}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tenantStats.map((stat) => (
                        <Card key={stat.title} className="p-6 text-center">
                            <div className={`mx-auto mb-2 ${stat.iconColor}`}>{stat.icon}</div>
                            <div className="text-lg font-semibold mb-2">{stat.title}</div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

const Dashboard: FC = () => {
    const {
        isAdmin,
        isUnassigned,
        hotels = [],
        hotel,
        guestCount = 0,
        roomsCount = 0,
        bookingsCount = 0,
        totalHotels = 0,
        totalRooms = 0,
        totalManagers = 0,
        totalGuests = 0,
        message = ''
    } = usePage().props as any;

    if (isUnassigned) {
        return <UnassignedUserView message={message} />;
    }

    if (isAdmin) {
        return (
            <AdminDashboardView
                hotels={hotels}
                totalHotels={totalHotels}
                totalRooms={totalRooms}
                totalManagers={totalManagers}
                totalGuests={totalGuests}
            />
        );
    }

    return (
        <TenantDashboardView
            hotel={hotel}
            guestCount={guestCount}
            roomsCount={roomsCount}
            bookingsCount={bookingsCount}
        />
    );
};

export default Dashboard;
