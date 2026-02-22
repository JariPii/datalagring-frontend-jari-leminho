import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'datetime-local';

export type SelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type CheckboxOption = { label: string; value: string };

export type FormField<
  TName extends string = string,
  TValue extends string = string,
> =
  | {
      kind?: 'input';
      name: TName;
      label?: string;
      type?: string;
      placeholder?: string;
      required?: boolean;
      disabled?: boolean;
      readOnly?: boolean;
    }
  | {
      kind: 'textarea';
      name: TName;
      label?: string;
      placeholder?: string;
      required?: boolean;
      disabled?: boolean;
      readOnly?: boolean;
      rows?: number;
    }
  | {
      kind: 'select';
      name: TName;
      label?: string;
      required?: boolean;
      disabled?: boolean;
      options: Array<{ label: string; value: TValue }>;
      placeholderOption?: string;
    }
  | {
      kind: 'checkbox-group';
      name: TName;
      label?: string;
      options: CheckboxOption[];
      defaultCheckedValues?: string[];
    }
  | { kind: 'hidden'; name: TName };

type Props<TValues extends Record<string, string>> =
  React.ComponentProps<'form'> & {
    fields: Array<FormField<Extract<keyof TValues, string>, string>>;
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

        const bucket = new Map<string, string[]>();
        for (const [k, v] of fd.entries()) {
          const arr = bucket.get(k) ?? [];
          arr.push(String(v));
          bucket.set(k, arr);
        }

        const values = { ...initialValues } as TValues;

        for (const [k, arr] of bucket.entries()) {
          (values as Record<string, string>)[k] =
            arr.length > 1 ? arr.join(',') : (arr[0] ?? '');
        }

        onSubmitValues(values);
      }}
      {...props}
    >
      {fields.map((f) => {
        const raw = initialValues[f.name as keyof TValues];
        const defaultValue = raw ?? '';

        if (f.kind === 'hidden') {
          return (
            <input
              key={f.name}
              type='hidden'
              name={f.name}
              defaultValue={defaultValue}
            />
          );
        }

        if (f.kind === 'select') {
          const selectId = `field-${f.name}`;

          return (
            <div key={f.name} className='grid gap-3'>
              {f.label ? (
                <Label htmlFor={selectId}>{f.label}</Label>
              ) : (
                <Label htmlFor={selectId} className='sr-only'>
                  {f.name}
                </Label>
              )}

              <select
                id={selectId}
                name={f.name}
                aria-label={f.label ?? f.name}
                className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                defaultValue={defaultValue}
                required={f.required}
                disabled={f.disabled}
              >
                {f.placeholderOption ? (
                  <option value='' disabled>
                    {f.placeholderOption}
                  </option>
                ) : null}

                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (f.kind === 'textarea') {
          return (
            <div key={f.name} className='grid gap-3'>
              {f.label ? <Label htmlFor={f.name}>{f.label}</Label> : null}
              <Textarea
                id={f.name}
                name={f.name}
                placeholder={f.placeholder}
                defaultValue={defaultValue}
                required={f.required}
                disabled={f.disabled}
                readOnly={f.readOnly}
                rows={f.rows ?? 4}
              />
            </div>
          );
        }

        if (f.kind === 'checkbox-group') {
          const groupId = `field-${f.name}`;
          const labelText = f.label ?? f.name;
          const checked = new Set(f.defaultCheckedValues ?? []);

          return (
            <div key={f.name} className='grid gap-3'>
              <Label htmlFor={groupId}>{labelText}</Label>

              <div id={groupId} className='grid gap-2'>
                {f.options.map((opt) => (
                  <label
                    key={opt.value}
                    className='flex items-center gap-2 text-sm'
                  >
                    <input
                      type='checkbox'
                      name={f.name}
                      value={opt.value}
                      className='h-4 w-4'
                      aria-label={`${labelText}: ${opt.label}`}
                      defaultChecked={checked.has(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={f.name} className='grid gap-3'>
            {f.label ? <Label htmlFor={f.name}>{f.label}</Label> : null}
            <Input
              id={f.name}
              name={f.name}
              type={f.type ?? 'text'}
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
