import * as React from 'react';
import { Edit } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import DynamicForm from '@/components/forms/DynamicForm';
import type { FormField } from '@/components/forms/DynamicForm';

type Props<TValues extends Record<string, string>> = {
  title: string;
  description?: string;
  fields: Array<FormField<Extract<keyof TValues, string>>>;
  initialValues: TValues;
  onSave: (values: TValues) => void;
};

const CDialog = <TValues extends Record<string, string>>({
  title,
  description,
  fields,
  initialValues,
  onSave,
}: Props<TValues>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className='cursor-pointer' />
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <DynamicForm<TValues>
          fields={fields}
          initialValues={initialValues}
          submitText='Save changes'
          onSubmitValues={(values) => {
            onSave(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CDialog;
