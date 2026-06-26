import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { communityService } from "@/services/communityService";
import { useToast } from "@/hooks/use-toast";

const REASONS = [
    { value: "spam", label: "Spam" },
    { value: "abuse", label: "Harassment or abuse" },
    { value: "off_topic", label: "Off-topic" },
    { value: "misinformation", label: "Misinformation" },
    { value: "other", label: "Other" },
] as const;

interface Props {
    commentId: string;
    contentSlug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReportCommentDialog({ commentId, contentSlug, open, onOpenChange }: Props) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleClose = () => {
        onOpenChange(false);
        setReason("");
        setDetails("");
    };

    const handleSubmit = async () => {
        if (!reason) return;
        setLoading(true);
        try {
            await communityService.reportComment(commentId, reason, details || undefined);
            if (typeof (window as any).umami !== "undefined") {
                (window as any).umami.track("Comment Reported", { content_slug: contentSlug, reason });
            }
            toast({ title: "Report submitted", description: "Thank you. We will review this comment." });
            handleClose();
        } catch (err: any) {
            const isDuplicate = err?.code === "23505";
            toast({
                title: isDuplicate ? "Already reported" : "Failed to submit report",
                description: isDuplicate
                    ? "You have already reported this comment."
                    : "Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report comment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REASONS.map(r => (
                                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Additional details{" "}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Textarea
                            placeholder="Provide any context that would help us review this..."
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!reason || loading}>
                        Submit report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
