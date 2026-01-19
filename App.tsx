
import React, { useState } from 'react';
import { CompletionModel, AppState } from './types';
import ModelSelector from './components/ModelSelector';
import InputForm from './components/InputForm';
import PredictionResult from './components/PredictionResult';
import { Calculator } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<AppState>({
    model: null,
    numberOfStudents: 0,
    numberOfFulfilledStudents: 0,
    numberOfDaysLeft: 0,
    numberOfTotalDays: 0,
  });

  const handleModelSelect = (model: CompletionModel) => {
    setState(prev => ({ ...prev, model }));
    setStep(2);
  };

  const handleInputsSubmit = (data: Omit<AppState, 'model'>) => {
    setState(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleReset = () => {
    setState({
      model: null,
      numberOfStudents: 0,
      numberOfFulfilledStudents: 0,
      numberOfDaysLeft: 0,
      numberOfTotalDays: 0,
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#112240] rounded-3xl shadow-2xl border border-[#233554] overflow-hidden">
        {/* Header */}
        <div className="bg-[#64ffda]/10 border-b border-[#233554] p-6 flex items-center gap-4">
          <Calculator className="w-8 h-8 text-[#64ffda]" />
          <h1 className="text-xl font-bold tracking-tight text-[#ccd6f6] uppercase">Class Assignment Predictor</h1>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 min-h-[400px] flex flex-col">
          {step === 1 && (
            <ModelSelector onSelect={handleModelSelect} />
          )}

          {step === 2 && (
            <InputForm 
              onSubmit={handleInputsSubmit} 
              onBack={() => setStep(1)}
              initialData={state}
            />
          )}

          {step === 3 && state.model && (
            <PredictionResult state={state} onReset={handleReset} />
          )}
        </div>
      </div>

      <footer className="mt-8 text-slate-500 text-sm">
        Predicting classroom performance with mathematics
      </footer>
    </div>
  );
};

export default App;
