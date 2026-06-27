'use client';

import { useEffect, useState } from 'react';
import { QuoteCard } from '@/components/quote-card';
import { quotesList } from '@/services/api';

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function Page() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [username, setUsername] = useState('usuário');

  useEffect(() => {
    const storedUser = window.localStorage.getItem('user');
    if (storedUser) {
      setUsername(storedUser);
    }

    const carregarDados = async () => {
      try {
        const resposta = await quotesList();
        setQuotes(resposta.data.quotes);
      } catch (error) {
        console.log(error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const handleSave = (updatedQuote: Quote) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((item) => (item.id === updatedQuote.id ? updatedQuote : item))
    );
  };

  if (carregando) {
    return <p>Carregando as frases...</p>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Bem-vindo ao Dashboard, {username}!</h1>
      </header>

      <section className="grid gap-4">
        {quotes.map((quoteItem) => (
          <QuoteCard key={quoteItem.id} quoteItem={quoteItem} onSave={handleSave} />
        ))}
      </section>
    </div>
  );
}