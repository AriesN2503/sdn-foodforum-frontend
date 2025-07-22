import { useState } from 'react';
import { Button } from './ui/button';

export default function CommentForm({ onSubmit, loading, initialValue = '', placeholder = 'Viết bình luận...', onCancel }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <textarea
        className="border rounded p-2 w-full min-h-[60px]"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !value.trim()} size="sm">
          {loading ? 'Đang gửi...' : 'Gửi'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
} 