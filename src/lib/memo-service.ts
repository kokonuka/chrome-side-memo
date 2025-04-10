import { Memo } from "@/types/memo";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "side-memo-notes";

export const getMemos = async (): Promise<Memo[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const memos = result[STORAGE_KEY] || [];
      resolve(memos);
    });
  });
};

export const saveMemo = async (
  memo: Omit<Memo, "id" | "createdAt" | "updatedAt">
): Promise<Memo> => {
  const memos = await getMemos();

  const newMemo: Memo = {
    id: uuidv4(),
    ...memo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedMemos = [...memos, newMemo];

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updatedMemos }, () => {
      resolve(newMemo);
    });
  });
};

export const updateMemo = async (
  id: string,
  updatedData: Partial<Omit<Memo, "id" | "createdAt" | "updatedAt">>
): Promise<Memo | null> => {
  const memos = await getMemos();
  const memoIndex = memos.findIndex((memo) => memo.id === id);

  if (memoIndex === -1) return null;

  const updatedMemo: Memo = {
    ...memos[memoIndex],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  memos[memoIndex] = updatedMemo;

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: memos }, () => {
      resolve(updatedMemo);
    });
  });
};

export const deleteMemo = async (id: string): Promise<boolean> => {
  const memos = await getMemos();
  const updatedMemos = memos.filter((memo) => memo.id !== id);

  if (updatedMemos.length === memos.length) return false;

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updatedMemos }, () => {
      resolve(true);
    });
  });
};
