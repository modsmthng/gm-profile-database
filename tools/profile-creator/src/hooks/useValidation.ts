import { useState, useEffect } from 'preact/hooks';
import type { AppState, FieldErrors } from '../types';
import { getFieldErrors, isSchemaValid } from '../validate';

export interface ValidationResult {
  errors: FieldErrors;
  errorCount: number;
  isValid: boolean;
}

export function useValidation(state: AppState): ValidationResult {
  const [result, setResult] = useState<ValidationResult>({
    errors: {},
    errorCount: 0,
    isValid: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const errors = getFieldErrors(state);
      const errorCount = Object.keys(errors).length;
      const isValid = errorCount === 0 && isSchemaValid(state);
      setResult({ errors, errorCount, isValid });
    }, 200);
    return () => clearTimeout(timer);
  }, [state]);

  return result;
}
