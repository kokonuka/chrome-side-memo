import { useState, useEffect } from "react";
import { Memo } from "@/types/memo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface MemoDetailProps {
  memo: Memo;
  onUpdate: (memo: { title: string; content: string }) => void;
  onDelete: (id: string) => void;
}

export function MemoDetail({ memo, onUpdate, onDelete }: MemoDetailProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = format(new Date(memo.updatedAt), "yyyy/MM/dd HH:mm");

  useEffect(() => {
    if (memo) {
      setTitle(memo.title);
      setContent(memo.content);
    }
  }, [memo]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsEditing(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate({ title, content });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // 確認なしで直接削除する
    onDelete(memo.id);
  };

  // タイトルやコンテンツの変更があった時に自動保存
  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        handleSave();
      }, 1000); // 1秒後に自動保存

      return () => clearTimeout(timer);
    }
  }, [title, content, isEditing]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-muted-foreground">
          最終更新：{formattedDate}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Input
        value={title}
        onChange={handleTitleChange}
        placeholder="タイトル"
        className="text-xl font-bold border-none px-0 focus-visible:ring-0 mb-2"
      />

      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="メモを入力..."
        className="flex-1 resize-none border-none px-0 focus-visible:ring-0 text-base"
      />
    </div>
  );
}
