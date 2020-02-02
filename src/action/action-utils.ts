export const categories: monzo.ActionCategory[] = [
  { value: 'bills', label: 'Bills' },
  { value: 'cash', label: 'Cash out' },
  { value: 'eating_out', label: 'Eating out' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'general', label: 'General' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'holidays', label: 'Holidays' },
  { value: 'mondo', label: 'Top-up' },
  { value: 'transport', label: 'Transport' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'personal_care', label: 'Personal Care' },
  { value: 'family', label: 'Family' },
];

export const categoryDict = categories.reduce<{ [key in monzo.Category]: string }>((obj, item) => {
  obj[item.value] = item.label;
  return obj;
}, {} as any);
