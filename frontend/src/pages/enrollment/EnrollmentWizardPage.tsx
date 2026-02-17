import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { enrollmentWizard } from "@/api";
import { Card, CardHeader, CardBody } from "@/components/ui";
import Stage1Participant from "@/components/enrollment/Stage1Participant";
import Stage2NextOfKin from "@/components/enrollment/Stage2NextOfKin";
import Stage3Nomination from "@/components/enrollment/Stage3Nomination";
import Stage4Admission from "@/components/enrollment/Stage4Admission";
import Stage5Bonding from "@/components/enrollment/Stage5Bonding";
import Stage6TrainingCosts from "@/components/enrollment/Stage6TrainingCosts";
import type { 
  EnrollmentProgressDto, 
  Stage1ParticipantDto,
  Stage2NextOfKinDto,
  Stage3NominationDto,
  Stage4AdmissionDto,
  Stage5BondDto,
  Stage6TrainingCostDto
} from "@/types";

type StageData = 
  | Stage1ParticipantDto 
  | Stage2NextOfKinDto 
  | Stage3NominationDto 
  | Stage4AdmissionDto 
  | Stage5BondDto 
  | Stage6TrainingCostDto;

export default function EnrollmentWizardPage() {
  const navigate = useNavigate();
  const { progressId: paramProgressId } = useParams<{ progressId: string }>();
  const [searchParams] = useSearchParams();
  const participantIdParam = searchParams.get("participantId");

  const [progressId, setProgressId] = useState<number | null>(
    paramProgressId ? parseInt(paramProgressId) : null
  );
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState<EnrollmentProgressDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize enrollment
  useEffect(() => {
    const initializeEnrollment = async () => {
      if (isInitialized) return;

      try {
        setLoading(true);
        setError(null);

        if (progressId) {
          // Load existing progress
          const progressData = await enrollmentWizard.getProgress(progressId);
          setProgress(progressData);
          setCurrentStage(progressData.currentStep);
        } else if (participantIdParam) {
          // Start enrollment with existing participant
          const result = await enrollmentWizard.startEnrollment(parseInt(participantIdParam));
          setProgressId(result.progressId);
          setCurrentStage(result.currentStep);
        }
        // Otherwise, wait for user to start enrollment from Stage 1

        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize enrollment");
      } finally {
        setLoading(false);
      }
    };

    initializeEnrollment();
  }, [progressId, participantIdParam, isInitialized]);

  const handleStageComplete = async (stageData: StageData, stage: number) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      let currentProgressId = progressId;

      // Special handling for Stage 1 without progressId
      // Create participant and start enrollment in one transaction
      if (stage === 1 && !currentProgressId) {
        const stage1Result = await enrollmentWizard.createAndEnroll(stageData as Stage1ParticipantDto);
        currentProgressId = stage1Result.progressId;
        setProgressId(currentProgressId);
        setCurrentStage(stage1Result.currentStep);
        return;
      }

      // Ensure we have a progressId for other stages
      if (!currentProgressId) {
        throw new Error("Enrollment not started. Please complete Stage 1 first.");
      }

      // Save the appropriate stage
      switch (stage) {
        case 1:
          result = await enrollmentWizard.saveStage1(currentProgressId, stageData);
          break;
        case 2:
          result = await enrollmentWizard.saveStage2(currentProgressId, stageData);
          break;
        case 3:
          result = await enrollmentWizard.saveStage3(currentProgressId, stageData);
          break;
        case 4:
          result = await enrollmentWizard.saveStage4(currentProgressId, stageData);
          break;
        case 5:
          result = await enrollmentWizard.saveStage5(currentProgressId, stageData);
          break;
        case 6:
          result = await enrollmentWizard.saveStage6(currentProgressId, stageData);
          if (result.enrollmentComplete) {
            // Enrollment completed - redirect to success page
            navigate(`/enrollment/complete/${currentProgressId}`, {
              state: { message: "Enrollment completed successfully!" }
            });
            return;
          }
          break;
      }

      // Move to next stage
      if (result?.nextStage) {
        setCurrentStage(result.nextStage);
      }

      // Reload progress
      const updatedProgress = await enrollmentWizard.getProgress(progressId);
      setProgress(updatedProgress);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save stage data");
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = (stage: number) => {
    setCurrentStage(stage);
  };

  const stages = [
    { number: 1, title: "Participant Info", icon: "👤" },
    { number: 2, title: "Next of Kin", icon: "👥" },
    { number: 3, title: "Nomination", icon: "📝" },
    { number: 4, title: "Admission", icon: "🎓" },
    { number: 5, title: "Bonding", icon: "📋" },
    { number: 6, title: "Training Costs", icon: "💰" }
  ];

  if (loading && !isInitialized) {
    return (
      <div className="page-content">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Initializing enrollment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header mb-4">
        <h1 className="page-title">Enrollment Wizard</h1>
        <p className="page-subtitle">
          {progressId ? `Progress ID: ${progressId}` : "Create new enrollment"}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Progress Stepper */}
      <Card className="mb-4">
        <CardBody>
          <div className="enrollment-stepper">
            <div className="stepper-container d-flex justify-content-between align-items-center">
              {stages.map((stage, index) => (
                <div key={stage.number} className="flex-fill">
                  <div className="d-flex align-items-center">
                    <button
                      className={`stepper-step ${
                        currentStage === stage.number ? "active" : ""
                      } ${
                        (progress && stage.number < currentStage) || 
                        (stage.number === 1 && progress?.form1Complete) ||
                        (stage.number === 2 && progress?.form2Complete) ||
                        (stage.number === 3 && progress?.form2Complete) ||
                        (stage.number === 4 && progress?.form3Complete) ||
                        (stage.number === 5 && progress?.form5Complete) ||
                        (stage.number === 6 && progress?.form6Complete)
                          ? "completed"
                          : ""
                      }`}
                      onClick={() => handleStageChange(stage.number)}
                      disabled={!progressId && stage.number > 1}
                    >
                      <div className="stepper-icon">{stage.icon}</div>
                      <div className="stepper-number">{stage.number}</div>
                      <div className="stepper-title">{stage.title}</div>
                    </button>
                    {index < stages.length - 1 && (
                      <div className="stepper-line flex-fill"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stage Content */}
      <Card>
        <CardHeader 
          title={`Stage ${currentStage}: ${stages[currentStage - 1].title}`}
          subtitle={`Step ${currentStage} of 6`}
        />
        <CardBody>
          {currentStage === 1 && (
            <Stage1Participant
              onComplete={(data) => handleStageComplete(data, 1)}
              onCancel={() => navigate("/enrollment")}
              loading={loading}
            />
          )}
          {currentStage === 2 && (
            <Stage2NextOfKin
              onComplete={(data) => handleStageComplete(data, 2)}
              onBack={() => setCurrentStage(1)}
              loading={loading}
            />
          )}
          {currentStage === 3 && (
            <Stage3Nomination
              onComplete={(data) => handleStageComplete(data, 3)}
              onBack={() => setCurrentStage(2)}
              loading={loading}
            />
          )}
          {currentStage === 4 && (
            <Stage4Admission
              onComplete={(data) => handleStageComplete(data, 4)}
              onBack={() => setCurrentStage(3)}
              loading={loading}
            />
          )}
          {currentStage === 5 && (
            <Stage5Bonding
              onComplete={(data) => handleStageComplete(data, 5)}
              onBack={() => setCurrentStage(4)}
              loading={loading}
            />
          )}
          {currentStage === 6 && (
            <Stage6TrainingCosts
              onComplete={(data) => handleStageComplete(data, 6)}
              onBack={() => setCurrentStage(5)}
              loading={loading}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
