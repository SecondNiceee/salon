import React, { FC } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface IErrorAlert{
    errorMessage : string,
    buttonAction : () => void
}
const ErrorAlert:FC<IErrorAlert> = ({buttonAction, errorMessage}) => {
    return (
      <div className="py-6">
        <AlertDialog  open={true} onOpenChange={() => {}}>
          <AlertDialogContent className='bg-white z-[60]'>
            <AlertDialogHeader>
              <AlertDialogTitle>Ошибка загрузки</AlertDialogTitle>
              <AlertDialogDescription>
                {errorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={buttonAction}
              >
                Перезагрузить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
};

export default ErrorAlert;
