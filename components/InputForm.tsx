
import React, { useState } from 'react';
import { AppState } from '../types';
import { ArrowLeft, Send } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: Omit<AppState, 'model'>) => void;
  onBack: () => void;
  initialData: AppState;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState({
    numberOfStudents: initialData.numberOfStudents || '',
    numberOfFulfilledStudents: initialData.numberOfFulfilledStudents || '',
    numberOfDaysLeft: initialData.numberOfDaysLeft || '',
    numberOfTotalDays: initialData.numberOfTotalDays || '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const students = parseInt(formData.numberOfStudents.toString());
    const fulfilled = parseInt(formData.numberOfFulfilledStudents.toString());
    const daysLeft = parseInt(formData.numberOfDaysLeft.toString());
    const totalDays = parseInt(formData.numberOfTotalDays.toString());

    if (isNaN(students) || isNaN(fulfilled) || isNaN(daysLeft) || isNaN(totalDays)) {
      setError("Please fill out all fields with valid numbers.");
      return;
    }

    if (fulfilled > students) {
      setError("Completed students cannot exceed total students.");
      return;
    }

    if (daysLeft > totalDays) {
      setError("Days left cannot exceed total assignment duration.");
      return;
    }

    onSubmit({
      numberOfStudents: students,
      numberOfFulfilledStudents: fulfilled,
      numberOfDaysLeft: daysLeft,
      numberOfTotalDays: totalDays,
    });
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-4">Class Statistics</h2>
        <p className="text-slate-400 mb-6">Enter the current numbers for your projection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">How many students are there?</label>
          <input
            type="number"
            min="1"
            value={formData.numberOfStudents}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfStudents: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">How many have completed it?</label>
          <input
            type="number"
            min="0"
            value={formData.numberOfFulfilledStudents}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfFulfilledStudents: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Total days for assignment?</label>
          <input
            type="number"
            min="1"
            value={formData.numberOfTotalDays}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfTotalDays: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 14"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Days left until due date?</label>
          <input
            type="number"
            min="0"
            value={formData.numberOfDaysLeft}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfDaysLeft: e.target.value }))}
            className={inputClass}
            placeholder="e.g. 3"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4 mt-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          Calculate <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default InputForm;
