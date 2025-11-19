export interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isOptional?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  // eslint-disable-next-line no-unused-vars
  onStepClick?: (stepIndex: number) => void;
  orientation?: "horizontal" | "vertical";
  allowClickToNavigate?: boolean;
}

export default function Stepper({ 
  steps, 
  currentStep, 
  onStepClick,
  orientation = "horizontal",
  allowClickToNavigate = true
}: StepperProps) {
  const handleStepClick = (index: number) => {
    if (allowClickToNavigate && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className={`stepper stepper-${orientation}`}>
      <div className="stepper-container">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || step.isCompleted;
          const isClickable = allowClickToNavigate && onStepClick;

          return (
            <div 
              key={step.id}
              className={`step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isClickable ? "clickable" : ""}`}
              onClick={() => handleStepClick(index)}
            >
              <div className="step-indicator">
                <div className="step-circle">
                  {isCompleted && !isActive ? (
                    <span className="step-check">✓</span>
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${isCompleted ? "completed" : ""}`} />
                )}
              </div>
              
              <div className="step-content">
                <div className="step-title">
                  {step.title}
                  {step.isOptional && <span className="optional-label">(Optional)</span>}
                </div>
                {step.description && (
                  <div className="step-description">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
