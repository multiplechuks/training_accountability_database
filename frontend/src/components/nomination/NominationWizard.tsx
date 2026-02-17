import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper, Step } from "../ui";
import { createParticipant } from "../../api/participant";
import type {
  Form1_ParticipantProfileData,
  Form2_NextOfKinData,
  Form3_NominationData,
  Form4_AdmissionData,
  Form5_BondingData,
  Form6_TrainingCostsData,
  Form7_CompletionData
} from "../../types/nomination";
import { updateEnrollmentStep, saveProgress } from "../../api/nomination";
import type { EnrollmentProgressDto } from "../../types/nomination";

// Import form components
import Form1_ParticipantProfile from "./forms/Form1_ParticipantProfile";
import Form2_NextOfKin from "./forms/Form2_NextOfKin";
import Form3_Nomination from "./forms/Form3_Nomination";
import Form4_Admission from "./forms/Form4_Admission";
import Form5_Bonding from "./forms/Form5_Bonding";
import Form6_TrainingCosts from "./forms/Form6_TrainingCosts";
import Form7_Completion from "./forms/Form7_Completion";

interface NominationWizardProps {
  progressId: number;
  initialStep?: number;
  initialData?: EnrollmentProgressDto;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function NominationWizard({
  progressId,
  initialStep = 1,
  initialData,
  onComplete,
  onCancel
}: NominationWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data for each step
  const [form1Data, setForm1Data] = useState<Form1_ParticipantProfileData>({
    participantId: initialData?.participantId
  });
  const [form2Data, setForm2Data] = useState<Form2_NextOfKinData>({});
  const [form3Data, setForm3Data] = useState<Form3_NominationData>({
    currentQualifications: [],
    yearOfNomination: new Date().getFullYear()
  });
  const [form4Data, setForm4Data] = useState<Form4_AdmissionData>({});
  const [form5Data, setForm5Data] = useState<Form5_BondingData>({});
  const [form6Data, setForm6Data] = useState<Form6_TrainingCostsData>({ allowances: [] });
  const [form7Data, setForm7Data] = useState<Form7_CompletionData>({});

  const steps: Step[] = [
    {
      id: "participant-profile",
      title: "Participant",
      description: "Select or create participant"
    },
    {
      id: "next-of-kin",
      title: "Next of Kin",
      description: "Emergency contact"
    },
    {
      id: "nomination",
      title: "Nomination",
      description: "Qualifications & program"
    },
    {
      id: "admission",
      title: "Admission",
      description: "Enrollment details"
    },
    {
      id: "bonding",
      title: "Bonding",
      description: "Bond & travel"
    },
    {
      id: "training-costs",
      title: "Training Costs",
      description: "Allowances"
    },
    {
      id: "completion",
      title: "Completion",
      description: "Review & finalize"
    }
  ];

  // Load saved data from initialData when component mounts
  useEffect(() => {
    if (initialData) {
      // Load Stage 2 - Next of Kin data
      if (initialData.stage2_NextOfKinData) {
        try {
          const stage2Data = JSON.parse(initialData.stage2_NextOfKinData);
          setForm2Data(stage2Data);
        } catch (_e) {
          // Failed to parse Stage 2 data - skip
        }
      }

      // Load Stage 3 - Nomination data
      if (initialData.stage3_NominationData) {
        try {
          const stage3Data = JSON.parse(initialData.stage3_NominationData);
          setForm3Data(stage3Data);
        } catch (_e) {
          // Failed to parse Stage 3 data - skip
        }
      }

      // Load Stage 4 - Admission data
      if (initialData.stage4_AdmissionData) {
        try {
          const stage4Data = JSON.parse(initialData.stage4_AdmissionData);
          setForm4Data(stage4Data);
        } catch (_e) {
          // Failed to parse Stage 4 data - skip
        }
      }

      // Load Stage 5 - Bonding data
      if (initialData.stage5_BondingData) {
        try {
          const stage5Data = JSON.parse(initialData.stage5_BondingData);
          setForm5Data(stage5Data);
        } catch (_e) {
          // Failed to parse Stage 5 data - skip
        }
      }

      // Load Stage 6 - Training Costs data
      if (initialData.stage6_TrainingCostsData) {
        try {
          const stage6Data = JSON.parse(initialData.stage6_TrainingCostsData);
          setForm6Data(stage6Data);
        } catch (_e) {
          // Failed to parse Stage 6 data - skip
        }
      }

      // Load Stage 7 - Completion notes
      if (initialData.notes) {
        try {
          const stage7Data = JSON.parse(initialData.notes);
          // Only set if it's actually stage 7 data (has completionNotes)
          if (stage7Data.completionNotes) {
            setForm7Data(stage7Data);
          }
        } catch (_e) {
          // If notes isn't JSON, it might be a simple string - skip
        }
      }
    }
  }, [initialData]);

  const handleSaveProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      await saveProgress(progressId, { notes: "Progress saved" });
      alert("Progress saved successfully!");
    } catch (err) {
      const errorMessage = err && typeof err === "object" && "response" in err
        ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to save progress")
        : "Failed to save progress";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStep = async (step: number) => {
    try {
      setLoading(true);
      setError(null);

      const updateData: Record<string, unknown> = {};

      // Step 1: Participant - either selected or created
      if (step === 1) {
        if (form1Data.participantId) {
          // Existing participant selected
          updateData.participantId = form1Data.participantId;
        } else {
          // Create new participant
          const participantData = {
            title: form1Data.title,
            firstname: form1Data.firstname!,
            lastname: form1Data.lastname!,
            middlename: form1Data.middlename,
            idNo: form1Data.idNo!,
            sex: form1Data.sex!,
            dob: form1Data.dob!,
            idType: form1Data.idType!,
            phone: form1Data.phone!,
            email: form1Data.email!,
            workTelephone: form1Data.workTelephone,
            designationFK: form1Data.designationFK,
            departmentOrFacility: form1Data.departmentOrFacility,
            dutyStation: form1Data.dutyStation
          };

          const newParticipant = await createParticipant(participantData);
          updateData.participantId = newParticipant.id;
        }
      }

      // Step 2: Next of Kin
      if (step === 2) {
        updateData.notes = JSON.stringify(form2Data);
      }

      // Step 3: Nomination
      if (step === 3) {
        updateData.notes = JSON.stringify(form3Data);
      }

      // Step 4: Admission
      if (step === 4) {
        updateData.notes = JSON.stringify(form4Data);
      }

      // Step 5: Bonding
      if (step === 5) {
        updateData.notes = JSON.stringify(form5Data);
      }

      // Step 6: Training Costs
      if (step === 6) {
        updateData.notes = JSON.stringify(form6Data);
      }

      // Step 7: Completion
      if (step === 7) {
        updateData.notes = JSON.stringify(form7Data);
      }

      await updateEnrollmentStep(progressId, step, updateData);

      if (step < 7) {
        setCurrentStep(step + 1);
      } else {
        // Completed all steps
        if (onComplete) {
          onComplete();
        } else {
          navigate("/nomination/list");
        }
      }
    } catch (err) {
      const errorMessage = err && typeof err === "object" && "response" in err
        ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || `Failed to complete step ${step}`)
        : `Failed to complete step ${step}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex + 1);
  };

  return (
    <div className="nomination-wizard">
      <div className="wizard-header">
        <h2>Nomination Process</h2>
        <p className="text-muted">Progress ID: {progressId}</p>
      </div>

      <Stepper steps={steps} currentStep={currentStep - 1} onStepClick={goToStep} />

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      <div className="wizard-content mt-4">
        {currentStep === 1 && (
          <Form1_ParticipantProfile
            data={form1Data}
            onDataChange={setForm1Data}
            onNext={() => handleCompleteStep(1)}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <Form2_NextOfKin
            data={form2Data}
            onDataChange={setForm2Data}
            onNext={() => handleCompleteStep(2)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <Form3_Nomination
            data={form3Data}
            onDataChange={setForm3Data}
            onNext={() => handleCompleteStep(3)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 4 && (
          <Form4_Admission
            data={form4Data}
            onDataChange={setForm4Data}
            onNext={() => handleCompleteStep(4)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 5 && (
          <Form5_Bonding
            data={form5Data}
            onDataChange={setForm5Data}
            onNext={() => handleCompleteStep(5)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 6 && (
          <Form6_TrainingCosts
            data={form6Data}
            onDataChange={setForm6Data}
            onNext={() => handleCompleteStep(6)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}

        {currentStep === 7 && (
          <Form7_Completion
            data={form7Data}
            onDataChange={setForm7Data}
            onComplete={() => handleCompleteStep(7)}
            onBack={prevStep}
            onSave={handleSaveProgress}
            loading={loading}
          />
        )}
      </div>

      {onCancel && (
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel Enrollment
          </button>
        </div>
      )}
    </div>
  );
}
