import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Building, Pencil, Plus } from 'lucide-react';
import { useState, type FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Hotel {
    tenant_id: number;
    hotel_name: string;
    address: string;
    contact_number: string;
    created_at: string;
}

interface HotelForm {
    hotel_name: string;
    address: string;
    contact_number: string;
}

const EMPTY_FORM: HotelForm = {
    hotel_name: '',
    address: '',
    contact_number: ''
};

const FormField: FC<{
    id: keyof HotelForm;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ id, label, value, onChange, error }) => (
    <div>
        <label className="block mb-1 font-medium" htmlFor={id}>
            {label}
        </label>
        <input
            id={id}
            name={id}
            type="text"
            value={value}
            onChange={onChange}
            className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            required
        />
        {error && (
            <div className="text-red-500 text-xs mt-1">{error}</div>
        )}
    </div>
);

const HotelFormDialog: FC<{
    open: boolean;
    isEdit: boolean;
    form: HotelForm;
    errors: Record<string, string>;
    loading: boolean;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}> = ({ open, isEdit, form, errors, loading, onClose, onChange, onSubmit }) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {isEdit ? 'Edit Hotel' : 'Add Hotel'}
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                    id="hotel_name"
                    label="Hotel Name"
                    value={form.hotel_name}
                    onChange={onChange}
                    error={errors.hotel_name}
                />
                <FormField
                    id="address"
                    label="Address"
                    value={form.address}
                    onChange={onChange}
                    error={errors.address}
                />
                <FormField
                    id="contact_number"
                    label="Contact Number"
                    value={form.contact_number}
                    onChange={onChange}
                    error={errors.contact_number}
                />
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading
                            ? (isEdit ? 'Saving...' : 'Adding...')
                            : (isEdit ? 'Save Changes' : 'Add Hotel')
                        }
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

const HotelRow: FC<{
    hotel: Hotel;
    onEdit: (hotel: Hotel) => void;
}> = ({ hotel, onEdit }) => (
    <tr className="border-b dark:border-gray-700">
        <td className="px-4 py-2 font-medium">{hotel.hotel_name}</td>
        <td className="px-4 py-2">{hotel.address}</td>
        <td className="px-4 py-2">{hotel.contact_number}</td>
        <td className="px-4 py-2">
            {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString() : '-'}
        </td>
        <td className="px-4 py-2 text-center">
            <Button
                size="sm"
                variant="outline"
                title="Edit"
                onClick={() => onEdit(hotel)}
            >
                <Pencil size={18} />
            </Button>
        </td>
    </tr>
);

export default function ManageHotels() {
    const { hotels = [] } = usePage().props as any;
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<HotelForm>(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setIsEdit(false);
        setEditId(null);
    };

    const handleOpen = () => {
        resetForm();
        setOpen(true);
    };

    const handleOpenEdit = (hotel: Hotel) => {
        setForm({
            hotel_name: hotel.hotel_name,
            address: hotel.address,
            contact_number: hotel.contact_number,
        });
        setErrors({});
        setIsEdit(true);
        setEditId(hotel.tenant_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const requestConfig = {
            onSuccess: () => {
                setLoading(false);
                handleClose();
            },
            onError: (err: any) => {
                setErrors(err);
                setLoading(false);
            },
        };

        if (isEdit && editId) {
            router.put(`/hotels/${editId}`, form as any, requestConfig);
        } else {
            router.post('/hotels', form as any, requestConfig);
        }
    };

    const tableHeaders = ['Hotel Name', 'Address', 'Contact Number', 'Created At', 'Actions'];

    return (
        <AppLayout breadcrumbs={[{ title: 'Manage Hotels', href: '/hotels' }]}>
            <Head title="Manage Hotels" />
            <div className='p-6'>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Building className="mr-2 text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold">Manage Hotels</h1>
                    </div>
                    <Button onClick={handleOpen} className='gap-2'>
                        <Plus size={18} /> Add Hotel
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                    <table className="min-w-full bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                {tableHeaders.map((header) => (
                                    <th key={header} className="px-4 py-2 text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.length > 0 ? (
                                hotels.map((hotel: Hotel) => (
                                    <HotelRow
                                        key={hotel.tenant_id}
                                        hotel={hotel}
                                        onEdit={handleOpenEdit}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={tableHeaders.length}
                                        className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No hotels found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <HotelFormDialog
                    open={open}
                    isEdit={isEdit}
                    form={form}
                    errors={errors}
                    loading={loading}
                    onClose={handleClose}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}
