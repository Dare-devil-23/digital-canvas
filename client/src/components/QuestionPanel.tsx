import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock questions data
const dummyQuestions = [
  "What is the capital of France?",
  "Solve for x: 2x + 5 = 15",
  "Name three primary colors",
  "What is the main function of mitochondria in a cell?",
  "Who wrote Romeo and Juliet?"
];

const QuestionPanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? dummyQuestions.length - 1 : prev - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => 
      prev === dummyQuestions.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className="absolute top-4 left-1/2 bg-background transform -translate-x-1/2 dark:bg-zinc-900 rounded-lg shadow-lg p-4 min-w-[300px] max-w-[600px] z-10">
      <div className="flex items-center justify-between">
        <button 
          onClick={goToPrevious}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Previous question"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="mx-4 text-center">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {dummyQuestions[currentIndex]}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Question {currentIndex + 1} of {dummyQuestions.length}
          </p>
        </div>
        
        <button 
          onClick={goToNext}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Next question"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default QuestionPanel; 