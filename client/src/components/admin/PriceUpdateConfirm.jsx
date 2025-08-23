import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export default function PriceUpdateConfirm({
  open,
  onOpenChange,
  details = [],
  onConfirm,
  onClose,
  title = "Price Update Detected",
  description = "The following price updates were detected:",
  showOnlyOk = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description && <p className="mb-3">{description}</p>}

            {details && details.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {details.map((d, idx) => (
                  <li key={idx}>
                    Price for{" "}
                    <b>{d.product?.name || "Product"}</b> changed
                    from <b>₹{d.oldPrice}</b> to <b>₹{d.newPrice}</b>
                  </li>
                ))}
              </ul>
            ) : !description ? (
              <p>No price updates detected.</p>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {showOnlyOk ? (
            <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


