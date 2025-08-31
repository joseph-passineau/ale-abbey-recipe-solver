import { useState } from 'react';
import {
  ConstraintsStep,
  IngredientsStep,
  ResultsScreen,
  StyleStep,
  WizardContainer,
} from './components';
import { DEFAULT_CONSTRAINTS } from './constants/constraints';
import { ingredients } from './data/ingredients';
import { styles } from './data/styles';
import { useRecipeSolver, useWizard } from './hooks';

interface Constraints {
  maxIngredients: number;
  objective: 'cheapest' | 'fewestIngredients';
  minGoodVirtues: number;
  virtueRequirements: {
    Flavor: 'Bad' | 'Neutral' | 'Good';
    Color: 'Bad' | 'Neutral' | 'Good';
    Strength: 'Bad' | 'Neutral' | 'Good';
    Foam: 'Bad' | 'Neutral' | 'Good';
  };
  requiredIngredients: string[];
}

function App() {
  const {
    currentStep,
    currentStepIndex,
    wizardSteps,
    goToNext,
    goToPrevious,
    goToStep,
    goToResults,
    reset: resetWizard,
    canGoNext: wizardCanGoNext,
    canGoPrevious,
    getNextButtonText,
  } = useWizard();

  const {
    loading,
    solution,
    error,
    solveRecipe,
    reset: resetSolver,
  } = useRecipeSolver();

  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [constraints, setConstraints] =
    useState<Constraints>(DEFAULT_CONSTRAINTS);

  const currentStyle = styles[currentStyleIndex];

  const canGoNext = () => {
    switch (currentStep) {
      case 'style':
        return true;
      case 'ingredients':
        return selectedIngredients.length > 0;
      case 'constraints':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const isLastStep = goToNext();
    if (isLastStep) {
      handleSolveRecipe();
    }
  };

  const handleSolveRecipe = async () => {
    goToResults();
    await solveRecipe(
      currentStyle,
      ingredients,
      selectedIngredients,
      constraints
    );
  };

  const handleReset = () => {
    resetWizard();
    resetSolver();
    setCurrentStyleIndex(0);
    setSelectedIngredients([]);
    setConstraints(DEFAULT_CONSTRAINTS);
  };

  const handleBackToConstraints = () => {
    resetSolver();
    goToStep('constraints');
  };

  if (currentStep === 'results') {
    return (
      <ResultsScreen
        solution={solution}
        error={error}
        loading={loading}
        style={currentStyle}
        ingredients={ingredients}
        onReset={handleReset}
        onBackToConstraints={handleBackToConstraints}
      />
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'style':
        return (
          <StyleStep
            styles={styles}
            currentStyleIndex={currentStyleIndex}
            onStyleChange={setCurrentStyleIndex}
          />
        );
      case 'ingredients':
        return (
          <IngredientsStep
            ingredients={ingredients}
            selectedIngredients={selectedIngredients}
            onSelectionChange={setSelectedIngredients}
          />
        );
      case 'constraints':
        return (
          <ConstraintsStep
            onConstraintsChange={setConstraints}
            availableIngredients={selectedIngredients}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const buttonEnabled = isLastStep
    ? canGoNext()
    : canGoNext() && wizardCanGoNext;

  return (
    <WizardContainer
      steps={wizardSteps}
      currentStep={currentStepIndex}
      onNext={handleNext}
      onPrevious={goToPrevious}
      canGoNext={buttonEnabled}
      canGoPrevious={canGoPrevious}
      nextButtonText={getNextButtonText()}
    >
      {renderStepContent()}
    </WizardContainer>
  );
}

export default App;
