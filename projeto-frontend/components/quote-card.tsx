'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Quote {
  id: number;
  quote: string;
  author: string;
}

interface QuoteCardProps {
  quoteItem: Quote;
  onSave: (updatedQuote: Quote) => void;
}

export function QuoteCard({ quoteItem, onSave }: QuoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    quote: quoteItem.quote,
    author: quoteItem.author,
  });
  const [errors, setErrors] = useState<{ quote?: string; author?: string }>({});
  const [lastAuthor, setLastAuthor] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      quote: quoteItem.quote,
      author: quoteItem.author,
    });
  }, [quoteItem]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lastAuthor');
      if (saved) setLastAuthor(saved);
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = formData.quote?.trim() ?? '';
    const a = formData.author?.trim() ?? '';
    const newErrors: { quote?: string; author?: string } = {};
    if (!q) newErrors.quote = 'A frase é obrigatória.';
    else if (q.length < 3) newErrors.quote = 'A frase é muito curta.';
    if (!a) newErrors.author = 'O autor é obrigatório.';
    else if (a.length < 2) newErrors.author = 'Nome do autor muito curto.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...quoteItem,
      quote: q,
      author: a,
    });
    try {
      localStorage.setItem('lastAuthor', a);
      setLastAuthor(a);
    } catch (e) {
      // ignore
    }
    setErrors({});
    setIsEditing(false);
  };

  return (
    <article className="rounded-xl border border-border bg-background p-6 shadow-sm">
      <p className="text-lg font-medium text-foreground">“{quoteItem.quote}”</p>
      <p className="mt-2 text-sm text-muted-foreground">— {quoteItem.author}</p>

      <div className="mt-4">
        <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Fechar' : 'Editar'}
        </Button>
      </div>

      {isEditing ? (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Frase</span>
            <Input
              value={formData.quote}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, quote: event.target.value }))
              }
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Autor</span>
            <Input
              value={formData.author}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, author: event.target.value }))
              }
            />
            {errors.author ? (
              <p className="text-xs text-red-500 mt-1">{errors.author}</p>
            ) : null}
            {lastAuthor && lastAuthor !== formData.author ? (
              <button
                type="button"
                className="mt-2 text-xs text-primary underline"
                onClick={() => setFormData((prev) => ({ ...prev, author: lastAuthor }))}
              >
                Usar autor salvo: {lastAuthor}
              </button>
            ) : null}
          </label>

          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={Boolean(errors.quote || errors.author)}>
              Salvar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  quote: quoteItem.quote,
                  author: quoteItem.author,
                });
                setErrors({});
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : null}
    </article>
  );
}
