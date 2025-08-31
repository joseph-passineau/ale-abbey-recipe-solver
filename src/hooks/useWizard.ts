import { useState } from 'react';

export type WizardStep = 'style' | 'ingredients' | 'constraints' | 'results';

export interface WizardStepConfig {
  id: string;
  title: string;
  description: string;
}

export function useWizard(initialStep: WizardStep = 'style') {
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const wizardSteps: WizardStepConfig[] = [
    {
      id: 'style',
      title: 'Choose Your Brewing Style',
      description: 'Select the type of ale you want to create',
    },
    {
      id: 'ingredients',
      title: 'Select Your Ingredients',
      description: 'Pick the ingredients you have available',
    },
    {
      id: 'constraints',
      title: 'Set Your Preferences',
      description: 'Configure optimization goals and constraints',
    },
  ];

  const goToNext = () => {
    if (currentStepIndex < wizardSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setCurrentStep(wizardSteps[nextIndex].id as WizardStep);
      return false;
    }
    return true;
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setCurrentStep(wizardSteps[prevIndex].id as WizardStep);
    }
  };

  const goToStep = (step: WizardStep) => {
    const stepIndex = wizardSteps.findIndex(s => s.id === step);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      setCurrentStep(step);
    }
  };

  const goToResults = () => {
    setCurrentStep('results');
  };

  const reset = () => {
    setCurrentStep('style');
    setCurrentStepIndex(0);
  };

  const canGoNext = currentStepIndex < wizardSteps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  const getNextButtonText = () => {
    if (currentStepIndex === wizardSteps.length - 1) {
      return 'Solve Recipe';
    }
    return 'Next';
  };

  return {
    currentStep,
    currentStepIndex,
    wizardSteps,
    goToNext,
    goToPrevious,
    goToStep,
    goToResults,
    reset,
    canGoNext,
    canGoPrevious,
    getNextButtonText,
  };
}
