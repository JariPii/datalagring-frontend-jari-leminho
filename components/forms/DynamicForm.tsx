import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FieldKind = 'input' | 'hidden';
export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'datetime-local';

export type FormField<TName extends string = string> = {
  name: TName;
  label?: string;
  kind?: FieldKind;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

type Props<TValues extends Record<string, string>> =
  React.ComponentProps<'form'> & {
    fields: Array<FormField<Extract<keyof TValues, string>>>;
    initialValues: TValues;
    submitText?: string;
    onSubmitValues: (values: TValues) => void;
  };

const DynamicForm = <TValues extends Record<string, string>>({
  className,
  fields,
  initialValues,
  submitText = 'Save',
  onSubmitValues,
  ...props
}: Props<TValues>) => {
  return (
    <form
      className={cn('grid items-start gap-6', className)}
      onSubmit={(e) => {
        props.onSubmit?.(e);
        e.preventDefault();

        const fd = new FormData(e.currentTarget);

        // bygg en typed copy av initialValues,
        // och ersätt keys som finns i fd.
        const values = { ...initialValues } as TValues;

        for (const [k, v] of fd.entries()) {
          // vi vet att våra fält är strings (Input).
          (values as Record<string, string>)[k] = String(v);
        }

        onSubmitValues(values);
      }}
      {...props}
    >
      {fields.map((f) => {
        const kind = f.kind ?? 'input';
        const type = f.type ?? 'text';

        const raw = initialValues[f.name];
        const defaultValue = raw ?? '';

        if (kind === 'hidden') {
          return (
            <input
              key={f.name}
              type='hidden'
              name={f.name}
              defaultValue={defaultValue}
            />
          );
        }

        return (
          <div key={f.name} className='grid gap-3'>
            {f.label ? <Label htmlFor={f.name}>{f.label}</Label> : null}
            <Input
              id={f.name}
              name={f.name}
              type={type}
              placeholder={f.placeholder}
              defaultValue={defaultValue}
              required={f.required}
              disabled={f.disabled}
              readOnly={f.readOnly}
            />
          </div>
        );
      })}

      <Button type='submit'>{submitText}</Button>
    </form>
  );
};

export default DynamicForm;
export type { Props as DynamicFormProps };
