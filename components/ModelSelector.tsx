
import React from 'react';
import { CompletionModel } from '../types';
import { TrendingUp, Zap, Activity } from 'lucide-react';

interface ModelSelectorProps {
  onSelect: (model: CompletionModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelect }) => {
  const options = [
    {
      id: CompletionModel.LINEAR,
      label: 'Linearly',
      desc: 'Students finish at a constant pace throughout the duration.',
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      id: CompletionModel.EXPONENTIAL,
      label: 'Exponentially',
      desc: 'Most students rush to finish as the deadline approaches.',
      icon: Zap,
      color: 'bg-purple-500',
    },
    {
      id: CompletionModel.SQUARE_ROOT,
      label: 'Square Root',
      desc: 'High initial enthusiasm that tapers off over time.',
      icon: Activity,
      color: 'bg-emerald-500',
    }
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">How does your class complete assignments?</h2>
        <p className="text-slate-400">Select the model that best describes your students' work habits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="group flex flex-col items-center p-6 bg-slate-700/50 hover:bg-slate-700 rounded-2xl border border-slate-600 transition-all hover:border-indigo-500 hover:scale-105"
          >
            <div className={`${option.color} p-4 rounded-xl mb-4 text-white group-hover:shadow-lg transition-shadow`}>
              <option.icon size={28} />
            </div>
            <span className="text-lg font-semibold mb-2 capitalize">{option.id}</span>
            <p className="text-sm text-slate-400 text-center leading-relaxed">
              {option.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
