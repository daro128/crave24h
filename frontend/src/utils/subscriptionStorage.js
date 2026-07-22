const DRAFT_KEY = "monthlySubscriptionDraft";

export const getDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || null;
  } catch {
    return null;
  }
};

export const saveDraft = (partial) => {
  const next = { ...(getDraft() || {}), ...partial };
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  return next;
};

export const clearDraft = () => sessionStorage.removeItem(DRAFT_KEY);
