import { useState, useEffect } from 'react';

import { Lote } from '../models/Lote.ts';
import LoteService from '../services/LoteService';

const useLotes = (campoId: string) => {
  const [lotes, setLotes] = useState<Lote[]>([]);

  useEffect(() => {
    if (!campoId) return;
    const fetchLotes = async () => {
      const response = await LoteService.getAllLotesByCampoId(campoId);
      // console.log(lotes);
      setLotes(response.data);
    };
    fetchLotes();
  }, []);

  return { lotes, setLotes };
};

export default useLotes;
