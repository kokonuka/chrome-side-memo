import { useState, useEffect } from "react";
import { Memo } from "@/types/memo";
import { MemoItem } from "@/components/memo-item";
import { MemoDetail } from "@/components/memo-detail";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { getMemos, saveMemo, updateMemo, deleteMemo } from "@/lib/memo-service";

export default function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMemo, setCurrentMemo] = useState<Memo | undefined>(undefined);
  const [activeView, setActiveView] = useState<"list" | "detail">("list");
  const [isNewMemo, setIsNewMemo] = useState(false);

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    setIsLoading(true);
    try {
      const loadedMemos = await getMemos();
      setMemos(
        loadedMemos.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
    } catch (error) {
      console.error("メモの読み込みに失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMemo = () => {
    setCurrentMemo({
      id: "temp-id", // 一時的なID。保存時に置き換えられる
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsNewMemo(true);
    setActiveView("detail");
  };

  const handleEditMemo = (memo: Memo) => {
    setCurrentMemo(memo);
    setIsNewMemo(false);
    setActiveView("detail");
  };

  const handleUpdateMemo = async (memoData: {
    title: string;
    content: string;
  }) => {
    try {
      if (currentMemo) {
        if (isNewMemo) {
          // 新規作成
          const newMemo = await saveMemo(memoData);
          setMemos((prevMemos) =>
            [newMemo, ...prevMemos].sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
          );
          setCurrentMemo(newMemo);
          setIsNewMemo(false);
        } else {
          // 更新
          const updatedMemo = await updateMemo(currentMemo.id, memoData);
          if (updatedMemo) {
            setMemos((prevMemos) =>
              prevMemos
                .map((memo) =>
                  memo.id === updatedMemo.id ? updatedMemo : memo
                )
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
            );
            setCurrentMemo(updatedMemo);
          }
        }
      }
    } catch (error) {
      console.error("メモの保存に失敗しました", error);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    try {
      if (id === "temp-id") {
        // 未保存の新規メモは単に一覧に戻る
        setCurrentMemo(undefined);
        setActiveView("list");
        return;
      }

      await deleteMemo(id);
      setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));

      // 削除したメモが現在表示しているメモなら一覧に戻る
      if (currentMemo && currentMemo.id === id) {
        setCurrentMemo(undefined);
        setActiveView("list");
      }
    } catch (error) {
      console.error("メモの削除に失敗しました", error);
    }
  };

  const handleBackToList = () => {
    // 確認なしで一覧に戻る
    setActiveView("list");
    setCurrentMemo(undefined);
    setIsNewMemo(false);
  };

  return (
    <div className="container px-4 py-4 max-w-3xl mx-auto h-screen flex flex-col">
      {activeView === "list" ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">メモ</h1>
            <Button onClick={handleCreateMemo} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">読み込み中...</div>
            ) : memos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                メモがありません。新しいメモを作成してください。
              </div>
            ) : (
              <div className="space-y-2">
                {memos.map((memo) => (
                  <MemoItem key={memo.id} memo={memo} onEdit={handleEditMemo} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              戻る
            </Button>
            {isNewMemo && (
              <span className="text-sm text-muted-foreground ml-2">
                新規メモ
              </span>
            )}
          </div>

          {currentMemo && (
            <MemoDetail
              memo={currentMemo}
              onUpdate={handleUpdateMemo}
              onDelete={handleDeleteMemo}
            />
          )}
        </>
      )}
    </div>
  );
}
