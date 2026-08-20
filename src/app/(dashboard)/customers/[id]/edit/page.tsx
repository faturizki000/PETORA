import { CustomerService } from '@/lib/services/customer.service';
import { CustomerForm } from '@/components/domain/customer/customer-form';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customer = await CustomerService.getById(params.id);
  if (!customer) {
    notFound();
  }

  const initial = {
    name: customer.name,
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    address: customer.address ?? '',
    city: customer.city ?? '',
    postal_code: customer.postal_code ?? '',
    emergency_contact: customer.emergency_contact ?? '',
    emergency_phone: customer.emergency_phone ?? '',
    notes: customer.notes ?? '',
    is_guest: customer.is_guest,
    tags: customer.tags,
    custom_fields: customer.custom_fields,
    referred_by: customer.referred_by ?? undefined,
    birth_date: customer.birth_date ?? '',
    gender: (customer.gender ?? undefined) as 'male' | 'female' | 'other' | undefined,
    id_number: '',
    create_account: false,
    username: '',
    pin: '',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Customer</h1>
        <p className="text-muted-foreground">Update customer information</p>
      </div>
      <CustomerForm id={params.id} customer={initial} />
    </div>
  );
}
