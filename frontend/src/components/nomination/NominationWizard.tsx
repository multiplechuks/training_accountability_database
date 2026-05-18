import { useState, useEffect } from "react";
import { Stepper, Step } from "../ui";
import { createParticipant, upsertNextOfKin, getNextOfKin } from "../../api/participant";
import { createNomination, updateNomination } from "../../api/training";
import type {
  Form1_ParticipantProfileData,
  Form2_NextOfKinData,
  Form3_NominationData,
} from "../../types/nomination";
import type { NominationResponseDto } from "../../types";

import Form1_ParticipantProfile from "./forms/Form1_ParticipantProfile";
import Form2_NextOfKin from "./forms/Form2_NextOfKin";
import Form3_Nomination from "./forms/Form3_Nomination";

interface NominationWizardProps {
  nominationId?: number;
  initialParticipantId?: number;
  initialNomination?: NominationResponseDto;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function NominationWizard({
  nominationId,
  initialParticipantId,
  initialNomination,
  onComplete,
  onCancel
}: NominationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [participantId, setParticipantId] = useState<number | undefined>(
    initialParticipantId ?? initialNomination?.participantFK
  );

  const [form1Data, setForm1Data] = useState<Form1_ParticipantProfileData>({
    participantId: initialParticipantId ?? initialNomination?.participantFK,
    selectedParticipantName: initialNomination?.participantName,
    idType: "NATIONAL_ID",
  });

  const [form2Data, setForm2Data] = useState<Form2_NextOfKinData>({});

  const [form3Data, setForm3Data] = useState<Form3_NominationData>({
    qualificationId: initialNomination?.qualificationFK ?? undefined,
    nominatedProgramId: initialNomination?.nominatedProgramFK ?? undefined,
    sponsorTypeId: initialNomination?.sponsorTypeFK ?? undefined,
    yearOfNomination: initialNomination?.yearOfNomination ?? new Date().getFullYear(),
    estimatedBudget: initialNomination?.estimatedBudget,
    professionalBody: initialNomination?.professionalBody,
    notes: initialNomination?.notes,
  });

  // Load next of kin when editing an existing nomination
  useEffect(() => {
    const pid = initialParticipantId ?? initialNomination?.participantFK;
    if (!pid) return;
    getNextOfKin(pid)
      .then((nok) => {
        if (nok) {
          setForm2Data({
            nextOfKinName: nok.fullName,
            nextOfKinRelationshipId: nok.relationshipTypeId,
            nextOfKinContactNo: nok.phone,
          });
        }
      })
      .catch(() => { /* next of kin not found, leave empty */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps: Step[] = [
    { id: "participant", title: "Participant", description: "Select or create participant" },
    { id: "next-of-kin", title: "Next of Kin", description: "Emergency contact" },
    { id: "nomination", title: "Nomination", description: "Qualifications & program" },
  ];

  const getErrorMessage = (err: unknown) => {
    if (err && typeof err === "object" && "response" in err) {
      const res = (err as { response?: { data?: { message?: string } } }).response;
      return res?.data?.message;
    }
    return err instanceof Error ? err.message : undefined;
  };

  const handleCompleteStep = async (step: number) => {
    try {
      setLoading(true);
      setError(null);

      if (step === 1) {
        let pid = form1Data.participantId;
        if (!pid) {
          const created = await createParticipant({
            titleFK: undefined,
            firstname: form1Data.firstname!,
            lastname: form1Data.lastname!,
            middlename: form1Data.middlename,
            idNumber: form1Data.idNo!,
            sex: form1Data.sex!,
            dob: form1Data.dob!,
            idTypeFK: undefined,
            phone: form1Data.phone!,
            email: form1Data.email!,
          });
          pid = created.pk;
        }
        setParticipantId(pid);
        setForm1Data(d => ({ ...d, participantId: pid }));
        setCurrentStep(2);
      }

      if (step === 2) {
        if (participantId && form2Data.nextOfKinName) {
          await upsertNextOfKin(participantId, {
            fullName: form2Data.nextOfKinName,
            relationshipTypeId: form2Data.nextOfKinRelationshipId,
            phone: form2Data.nextOfKinContactNo,
          });
        }
        setCurrentStep(3);
      }

      if (step === 3) {
        if (!participantId) throw new Error("Participant is required");

        const payload = {
          participantId: participantId,
          yearOfNomination: form3Data.yearOfNomination ?? new Date().getFullYear(),
          qualificationId: form3Data.qualificationId,
          nominatedProgramId: form3Data.nominatedProgramId,
          sponsorTypeId: form3Data.sponsorTypeId,
          estimatedBudget: form3Data.estimatedBudget,
          currency: "BWP",
          professionalBody: form3Data.professionalBody,
          notes: form3Data.notes,
        };

        if (nominationId) {
          await updateNomination(nominationId, payload);
        } else {
          await createNomination(payload);
        }

        onComplete?.();
      }
    } catch (err) {
      setError(getErrorMessage(err) || `Failed to complete step ${step}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{nominationId ? "Edit Nomination" : "New Nomination"}</h2>
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <Stepper steps={steps} currentStep={currentStep - 1} onStepClick={(i) => { if (i + 1 < currentStep) setCurrentStep(i + 1); }} />

      <div className="mt-4">
        {currentStep === 1 && (
          <Form1_ParticipantProfile
            data={form1Data}
            onDataChange={setForm1Data}
            onNext={() => handleCompleteStep(1)}
            loading={loading}
          />
        )}
        {currentStep === 2 && (
          <Form2_NextOfKin
            data={form2Data}
            onDataChange={setForm2Data}
            onNext={() => handleCompleteStep(2)}
            onBack={() => setCurrentStep(1)}
            loading={loading}
          />
        )}
        {currentStep === 3 && (
          <Form3_Nomination
            data={form3Data}
            onDataChange={setForm3Data}
            onNext={() => handleCompleteStep(3)}
            onBack={() => setCurrentStep(2)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
