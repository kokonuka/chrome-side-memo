import { Memo } from "@/types/memo";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MemoItemProps {
  memo: Memo;
  onEdit: (memo: Memo) => void;
}

export const MemoItem = ({ memo, onEdit }: MemoItemProps) => {
  const formattedDate = format(new Date(memo.updatedAt), "yyyy/MM/dd");

  // メモ内容のプレビューテキストを生成（短く切り取る）
  const previewText =
    memo.content.length > 60
      ? `${memo.content.substring(0, 60)}...`
      : memo.content;

  return (
    <div
      className="px-3 py-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
      onClick={() => onEdit(memo)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <h3
            className={cn(
              "font-medium",
              memo.title ? "text-black" : "text-gray-500"
            )}
          >
            {memo.title || "無題のメモ"}
          </h3>
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {formattedDate}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {previewText || "内容なし"}
        </p>
      </div>
    </div>
  );
};
