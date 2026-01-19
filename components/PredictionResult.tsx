
import React from 'react';
import { AppState, CompletionModel } from '../types';
import { RefreshCcw, CheckCircle2, AlertCircle, Info, Activity, ShieldCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PredictionResultProps {
  state: AppState;
  onReset: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ state, onReset }) => {
  const { model, numberOfStudents, numberOfFulfilledStudents, numberOfDaysLeft, numberOfTotalDays } = state;

  // Logic calculation based on prompt and model choices
  const calculateFinal = () => {
    const daysRemainingRatio = numberOfDaysLeft / numberOfTotalDays;
    let newFulfilledStudents = 0;

    switch (model) {
      case CompletionModel.LINEAR:
        // Logic from python snippet: newFulfilledStudents = numberOfDaysLeft/numberOfTotalDays*numberOfStudents
        newFulfilledStudents = (numberOfDaysLeft / numberOfTotalDays) * numberOfStudents;
        break;
      case CompletionModel.EXPONENTIAL:
        // Exponential: Growth accelerates as deadline approaches
        newFulfilledStudents = Math.pow(daysRemainingRatio, 1.5) * numberOfStudents;
        break;
      case CompletionModel.SQUARE_ROOT:
        // Square Root: Early momentum that slows down
        newFulfilledStudents = Math.sqrt(daysRemainingRatio) * numberOfStudents;
        break;
      default:
        newFulfilledStudents = (numberOfDaysLeft / numberOfTotalDays) * numberOfStudents;
    }

    const rawFinal = numberOfFulfilledStudents + newFulfilledStudents;
    const isCapped = rawFinal > numberOfStudents;
    const final = Math.min(numberOfStudents, rawFinal);
    
    return { final, isCapped, rawFinal };
  };

  const { final, isCapped } = calculateFinal();
  const roundedFinal = Math.round(final);
  const completionPercentage = (roundedFinal / numberOfStudents) * 100;

  // Generate chart data
  const generateChartData = () => {
    const data = [];
    // Use integer steps for the number of total days
    const points = numberOfTotalDays;
    const daysPassed = numberOfTotalDays - numberOfDaysLeft;
    
    for (let i = 0; i <= points; i++) {
      const day = i; // Day is now an integer
      const isPast = day <= daysPassed;
      
      let students = 0;
      if (isPast) {
        // Avoid division by zero if assignment just started
        students = daysPassed === 0 ? numberOfFulfilledStudents : (day / daysPassed) * numberOfFulfilledStudents;
      } else {
        const remainingTimeRatio = (day - daysPassed) / numberOfDaysLeft;
        let predictionFactor = 0;
        
        switch (model) {
          case CompletionModel.LINEAR:
            predictionFactor = remainingTimeRatio;
            break;
          case CompletionModel.EXPONENTIAL:
            predictionFactor = Math.pow(remainingTimeRatio, 1.5);
            break;
          case CompletionModel.SQUARE_ROOT:
            predictionFactor = Math.sqrt(remainingTimeRatio);
            break;
        }
        
        const predictedFromNow = (final - numberOfFulfilledStudents) * predictionFactor;
        students = numberOfFulfilledStudents + predictedFromNow;
      }

      data.push({
        day: day, // Pure integer value
        students: Math.round(Math.min(students, numberOfStudents)),
        status: isPast ? 'Current' : 'Predicted'
      });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${isCapped ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#64ffda]/20 text-[#64ffda]'}`}>
          {isCapped ? <ShieldCheck size={32} /> : <CheckCircle2 size={32} />}
        </div>
        
        {isCapped && (
          <div className="mb-4">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
              Full Capacity Reached
            </span>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4 text-[#ccd6f6]">
          {roundedFinal} {roundedFinal === 1 ? 'student' : 'students'} will have completed the task
        </h2>
        <p className="text-slate-400 text-lg">
          by the assigned due date based on {model} completion.
        </p>
      </div>

      <div className="bg-[#0a192f]/50 rounded-2xl p-6 border border-[#233554]">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Activity size={16} /> Projected Completion Curve
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64ffda" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64ffda" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#8892b0" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => Math.floor(value).toString()}
                label={{ value: 'Days Passed', position: 'insideBottom', offset: -5, fill: '#8892b0', fontSize: 10 }}
              />
              <YAxis 
                stroke="#8892b0" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, numberOfStudents]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#112240', border: '1px solid #233554', borderRadius: '8px' }}
                itemStyle={{ color: '#64ffda' }}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#64ffda" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStudents)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#112240] p-4 rounded-xl flex items-start gap-4 border border-[#233554]">
          <div className="bg-[#64ffda]/10 p-2 rounded-lg text-[#64ffda]">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Completion Rate</p>
            <p className="text-xl font-bold text-[#ccd6f6]">{completionPercentage.toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-[#112240] p-4 rounded-xl flex items-start gap-4 border border-[#233554]">
          <div className={`p-2 rounded-lg ${isCapped ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Remaining Slots</p>
            <p className="text-xl font-bold text-[#ccd6f6]">{Math.max(0, numberOfStudents - roundedFinal)} Students</p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#64ffda] hover:bg-[#64ffda]/90 text-[#0a192f] rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#64ffda]/10"
      >
        <RefreshCcw size={20} /> Start New Prediction
      </button>
    </div>
  );
};

export default PredictionResult;
