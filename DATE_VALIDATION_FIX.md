# Date Validation Fix - Instructions

To prevent future dates in asset creation forms, make the following changes:

## 1. In CreateAsset.tsx - Update handleSubmit function

Find the `handleSubmit` function (around line 34) and add this validation at the beginning:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  setSuccess(false);
  setError(null);

  // Validate date - no future dates allowed
  const purchaseDate = new Date(form.date_purchased);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (purchaseDate > today) {
    setError('Purchase date cannot be in the future. Please select today or an earlier date.');
    setSaving(false);
    return;
  }

  console.log('CreateAsset - user object:', user);
  // ... rest of the code
```

## 2. In CreateAsset.tsx - Update date input field

Find the date input field (around line 130) and update it:

```tsx
<div className="space-y-2">
  <Label htmlFor="date">Date Purchased</Label>
  <Input
    id="date"
    type="date"
    value={form.date_purchased}
    onChange={(e) => setForm({ ...form, date_purchased: e.target.value })}
    max={new Date().toISOString().split('T')[0]}
    required
  />
  <p className="text-xs text-slate-500">Only today or past dates are allowed</p>
</div>
```

## 3. In AssetManagement.tsx - Update handleSubmit function

Find the `handleSubmit` function (around line 83) and add this validation:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Validate date - no future dates allowed
    const purchaseDate = new Date(formData.date_purchased);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (purchaseDate > today) {
      toast.error('Purchase date cannot be in the future. Please select today or an earlier date.');
      return;
    }

    const assetData = {
      // ... rest of the code
```

## 4. In AssetManagement.tsx - Update date input field

Find the Purchase Date input (around line 260) and update it:

```tsx
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
  <input
    type="date"
    value={formData.date_purchased}
    onChange={(e) => setFormData({ ...formData, date_purchased: e.target.value })}
    max={new Date().toISOString().split('T')[0]}
    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <p className="text-xs text-slate-500 mt-1">Only today or past dates are allowed</p>
</div>
```

These changes will:
1. Add a `max` attribute to date inputs preventing users from selecting future dates in the UI
2. Add server-side validation in handleSubmit to reject any future dates
3. Add helpful text to inform users about the date restriction
