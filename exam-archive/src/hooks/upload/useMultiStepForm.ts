import { ReactElement, useState } from "react";

export function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const next = () => {
    setCurrentStepIndex((currentIndex) => {
      return currentIndex >= steps.length ? currentIndex : currentIndex + 1;
    });
  };

  const back = () => {
    setCurrentStepIndex((currentStepIndex) => {
      return currentStepIndex <= 0 ? currentStepIndex : currentStepIndex - 1;
    });
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    lastIndex: steps.length - 1,
    componentToRender: steps[currentStepIndex],
    goTo,
    next,
    back,
  };
}
