import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';
import { toAppError } from './api-error';

/**
 * Maps API validation errors onto form fields; anything that can't be mapped becomes a toast.
 * Returns the normalised error for further handling.
 */
export function handleFormError<T extends FieldValues>(error: unknown, setError?: UseFormSetError<T>, knownFields: string[] = []) {
  const appError = toAppError(error);
  let mapped = false;
  if (setError) {
    for (const [field, message] of Object.entries(appError.fieldErrors)) {
      if (knownFields.length && !knownFields.includes(field)) continue;
      setError(field as Path<T>, { type: 'server', message: message || appError.message });
      mapped = true;
    }
  }
  if (!mapped || !appError.isValidation) toast.error(appError.message);
  return appError;
}
