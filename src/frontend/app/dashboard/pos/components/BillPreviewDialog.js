import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import { generateInvoiceBlobUrl } from '@/utils/pdfGenerator';

export default function BillPreviewDialog({
  open,
  onOpenChange,
  customer,
  cart,
  totals,
  paymentDetails,
  onConfirm,
  loading
}) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    let active = true;

    const loadPreview = async () => {
      if (open && customer && cart.length) {
        try {
          const { method, paid, due } = paymentDetails;
          // Use a temporary ID for preview
          const url = await generateInvoiceBlobUrl(customer, "PREVIEW", cart, method, paid, due);
          if (active) {
            setPdfUrl(url);
          }
        } catch (error) {
          console.error("Failed to generate preview", error);
        }
      } else {
        if (active) setPdfUrl(null);
      }
    };

    loadPreview();

    return () => {
      active = false;
    };
  }, [open, customer, cart, paymentDetails]);

  if (!customer || !cart.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bill Preview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 w-full bg-gray-100 rounded-md overflow-hidden border">
          {pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                Confirm & Print
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
