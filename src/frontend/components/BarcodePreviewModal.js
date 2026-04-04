import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from 'lucide-react';

export function BarcodePreviewModal({ isOpen, onClose, pdfUrl, onPrint }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Barcode Preview</DialogTitle>
                </DialogHeader>

                <div className="flex-1 w-full bg-muted/20 rounded-md overflow-hidden border">
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="Barcode Preview"
                        />
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onPrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
