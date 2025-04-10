import { useState, useEffect } from "react";
import { Memo } from "@/types/memo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MemoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memo: { title: string; content: string }) => void;
  memo?: Memo;
}

export const MemoDialog = ({
  isOpen,
  onClose,
  onSave,
  memo,
}: MemoDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (memo) {
      setTitle(memo.title);
      setContent(memo.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [memo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{memo ? "メモを編集" : "新しいメモ"}</DialogTitle>
            <DialogDescription>
              {memo ? "既存のメモを編集します。" : "新しいメモを作成します。"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトル"
                className="text-lg font-medium focus-visible:ring-1"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="メモ内容を入力..."
                rows={8}
                className="resize-none focus-visible:ring-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
