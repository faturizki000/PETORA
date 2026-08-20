import { PetService } from '@/lib/services/pet.service';
import { PetHealthTimeline } from '@/components/domain/pet/pet-health-timeline';
import { PetForm } from '@/components/domain/pet/pet-form';
import { AppointmentService } from '@/lib/services/appointment.service';
import { MedicalRecordService } from '@/lib/services/medical-record.service';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await PetService.getById(params.id);
  if (!pet) {
    notFound();
  }

  const appointments = await AppointmentService.list({ pet_id: params.id, limit: 10 });
  const medicalRecords = await MedicalRecordService.list({ pet_id: params.id, limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pet.name}</h1>
          <p className="text-muted-foreground">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
        </div>
        <Button variant="outline">Edit</Button>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical">Medical Records</TabsTrigger>
          <TabsTrigger value="timeline">Health Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Species:</span> {pet.species}</div>
                <div><span className="text-muted-foreground">Breed:</span> {pet.breed || '-'}</div>
                <div><span className="text-muted-foreground">Gender:</span> {pet.gender || '-'}</div>
                <div><span className="text-muted-foreground">Color:</span> {pet.color || '-'}</div>
                <div><span className="text-muted-foreground">Birth Date:</span> {pet.birth_date || '-'}</div>
                <div><span className="text-muted-foreground">Neutered:</span> {pet.is_neutered ? 'Yes' : 'No'}</div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Health Information</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Microchip:</span> {pet.microchip_number || '-'}</div>
                <div><span className="text-muted-foreground">Pedigree:</span> {pet.pedigree_number || '-'}</div>
                <div><span className="text-muted-foreground">Temperament:</span> {pet.temperament || '-'}</div>
                <div><span className="text-muted-foreground">Special Needs:</span> {pet.special_needs || '-'}</div>
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="appointments">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Appointments</h3>
            <p className="text-muted-foreground text-sm">{appointments.data?.length || 0} appointments</p>
          </Card>
        </TabsContent>
        <TabsContent value="medical">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Medical Records</h3>
            <p className="text-muted-foreground text-sm">{medicalRecords.data?.length || 0} records</p>
          </Card>
        </TabsContent>
        <TabsContent value="timeline">
          <PetHealthTimeline petId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
